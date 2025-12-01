import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = { vus: 1, iterations: 1 };

const host = {
    url: __ENV.HOST_URL || 'http://localhost',
    port: __ENV.HOST_PORT || '4000',
    toString() {
        return `${this.url}:${this.port}/api`;
    }
};

let concesionaryTokens = [];
let modelCarIds = [];
let saleCarIds = [];
let buyerTokens = [];

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

    if (!token) {
        console.error("❌ Login respondió 200 pero no devolvió accessToken");
        console.error(loginRes.body);
        return;
    }

    if (role === "CONCESIONARY") {
        concesionaryTokens.push(token);
        console.log(`🔐 Token CONCESIONARY guardado: ${token.substring(0, 20)}...`);
    } else if (role === "BUYER") {
        buyerTokens.push(token);
        console.log(`👤 Token BUYER guardado: ${token.substring(0, 20)}...`);
    }
}

function createModelCars() {
    if (concesionaryTokens.length === 0) {
        console.error("❌ No hay tokens de concesionarios para crear model cars");
        return;
    }

    console.log(`🚗 Creando 10 model cars...`);

    for (let i = 0; i < 10; i++) {
        const token = concesionaryTokens[i % concesionaryTokens.length];

        const body = JSON.stringify({
            brand: `Brand${i}`,
            model: `Model${i}`,
            description: "Load test model",
        });

        const res = request(
            "POST",
            "/model-cars",
            `Create model car ${i}`,
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
            console.log(`📌 ModelCar ID guardado: ${id}`);
        }

        sleep(0.5);
    }
}

function createSaleCars() {
    if (modelCarIds.length === 0) {
        console.error("❌ No hay model cars creados, no se pueden generar publicaciones");
        return;
    }

    console.log(`📢 Creando publicaciones (sale-cars)...`);

    let pubCount = 0;

    for (let i = 0; i < concesionaryTokens.length; i++) {
        const token = concesionaryTokens[i];

        // Cada concesionario crea 3 publicaciones
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
                console.log(`📦 SaleCar creado → ID: ${id}`);
            }
            sleep(0.3);
        }
    }
}

function buyersCreatePurchases() {
    if (buyerTokens.length === 0 || saleCarIds.length === 0) {
        console.error("❌ No hay buyers o saleCars → No se pueden crear purchases");
        return;
    }

    console.log("💸 Buyers creando purchases...");

    let purchaseCount = Math.min(buyerTokens.length, saleCarIds.length);

    for (let i = 0; i < purchaseCount; i++) {
        const token = buyerTokens[i];
        const saleCarId = saleCarIds[i];

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

        sleep(0.5);
    }
}

export default function () {
    console.log("👤 Creando 7 BUYER y 7 CONCESIONARY...");

    for (let i = 0; i < 7; i++) createUserAndLogin("BUYER");
    for (let i = 0; i < 7; i++) createUserAndLogin("CONCESIONARY");

    console.log(`✔️ Tokens de concesionarios: ${concesionaryTokens.length}`);

    createModelCars();

    console.log(`✔️ ModelCars creados: ${modelCarIds.length}`);

    createSaleCars();

    buyersCreatePurchases();
}
