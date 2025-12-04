import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  insecureSkipTLSVerify: true,
  stages: [
    { duration: '30s', target: 10 },  
    { duration: '1m', target: 20 },   
    { duration: '30s', target: 0 }, 
  ],
};

const host = {
  url: __ENV.HOST_URL || 'http://localhost',
  port: __ENV.HOST_PORT || '4000',
  toString() {
    return `${this.url}:${this.port}/api`;
  }
};

function request(method, route, desc, body = null, params = {}) {
  const res = http.request(method, `${host.toString()}${route}`, body, params);

  const ok = check(res, {
    [`${desc} OK`]: (r) => r.status >= 200 && r.status < 300,
  });

  if (!ok) {
    console.error(`❌ ${desc} FAILED (${res.status}) → ${res.body}`);
  } else {
    console.log(`✅ ${desc} → ${res.status}`);
  }

  return res;
}

function createUserAndLogin(role) {
  const email = `user_${Math.random().toString(36).slice(2)}@test.com`;

  const registerBody = {
    fullname: "Test user",
    email,
    password: "Test1234!",
    role,
  };

  if (role === "CONCESIONARY") {
    registerBody.fullname = "Test concesionary";
    registerBody.concesionaryCuit = `20${Math.floor(100000000 + Math.random() * 900000000)}`;
  }

  request(
    "POST",
    "/auth/register",
    `Register ${role}`,
    JSON.stringify(registerBody),
    { headers: { "Content-Type": "application/json" } }
  );

  const loginRes = request(
    "POST",
    "/auth/login",
    `Login ${role}`,
    JSON.stringify({ email, password: "Test1234!" }),
    { headers: { "Content-Type": "application/json" } }
  );

  const token = loginRes.json("accessToken");
  return token;
}


const carBrands = [
  "Toyota", "Ford", "Chevrolet", "Volkswagen", "Honda",
  "Nissan", "BMW", "Mercedes-Benz", "Audi", "Peugeot"
];

const carModels = [
  "Corolla", "Fiesta", "Cruze", "Golf", "Civic",
  "Sentra", "320i", "C-Class", "A4", "208"
];

function createModelCars(concesionaryTokens) {
  let modelCarIds = [];

  for (let i = 0; i < carBrands.length; i++) {
    const token = concesionaryTokens[i % concesionaryTokens.length];

    const body = JSON.stringify({
      brand: carBrands[i],
      model: carModels[i],
      description: "Vehículo de prueba para carga",
    });

    const res = request(
      "POST",
      "/model-cars",
      `Create model car ${carBrands[i]} ${carModels[i]}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );

    const id = res.json("id");
    if (id) {
      modelCarIds.push(id);
    }

    sleep(0.2);
  }

  return modelCarIds;
}

function createSaleCars(concesionaryTokens, modelCarIds) {
  let saleCarIds = [];
  let pubCount = 0;

  for (let i = 0; i < concesionaryTokens.length; i++) {
    const token = concesionaryTokens[i];

    for (let j = 0; j < 3; j++) {
      const modelCarId = modelCarIds[(i + j) % modelCarIds.length];

      const body = JSON.stringify({
        modelCarId,
        price: Math.floor(15000 + Math.random() * 50000),
      });

      const res = request(
        "POST",
        "/sale-car",
        `Create sale-car (pub) ${pubCount++}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      const id = res.json("id");
      if (id) {
        saleCarIds.push(id);
      }
      sleep(0.2);
    }
  }

  return saleCarIds;
}

// --------------------
// SETUP
// --------------------
export function setup() {
  let buyerTokens = [];
  let concesionaryTokens = [];

  for (let i = 0; i < 7; i++) buyerTokens.push(createUserAndLogin("BUYER"));
  for (let i = 0; i < 7; i++) concesionaryTokens.push(createUserAndLogin("CONCESIONARY"));

  const modelCarIds = createModelCars(concesionaryTokens);
  const saleCarIds = createSaleCars(concesionaryTokens, modelCarIds);

  return { buyerTokens, saleCarIds };
}

// --------------------
// TEST DE CARGA
// --------------------
export default function (data) {
  const { buyerTokens, saleCarIds } = data;

  const token = buyerTokens[Math.floor(Math.random() * buyerTokens.length)];
  const saleCarId = saleCarIds[Math.floor(Math.random() * saleCarIds.length)];

  request(
    "POST",
    `/purchases/${saleCarId}`,
    `Buyer purchase ${saleCarId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );

  sleep(1);
}