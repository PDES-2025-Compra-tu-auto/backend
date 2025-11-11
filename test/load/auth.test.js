import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 3,
  duration: '30s',
};

export default function () {
  const email = `user_${randomString(5)}@test.com`;
  const password = 'Test1234!';
  const role = randomItem(['BUYER', 'ADMINISTRATOR', 'CONCESIONARY']);

  const registerBody = {
    fullname: 'Test User',
    email,
    password,
    role,
  };

  if (role === 'CONCESIONARY') {
    registerBody.concesionaryName = `Concesionaria_${randomString(4)}`;
    registerBody.concesionaryCuit = `20${Math.floor(Math.random() * 100000000)}`;
  }

  const registerHeaders = { 'Content-Type': 'application/json' };

  const registerRes = http.post(
    'http://localhost:4000/api/auth/register',
    JSON.stringify(registerBody),
    { headers: registerHeaders }
  );

  check(registerRes, { 'register status 201': (r) => r.status === 201 });

  if (registerRes.status !== 201) {
    console.log('❌ REGISTER ERROR:', registerRes.status, registerRes.body);
    return; // no intento login si el registro falló
  }

  const loginPayload = JSON.stringify({ email, password });
  const loginRes = http.post(
    'http://localhost:4000/api/auth/login',
    loginPayload,
    { headers: registerHeaders }
  );

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'has accessToken': (r) => {
      try {
        const data = JSON.parse(r.body);
        return !!data.accessToken;
      } catch {
        return false;
      }
    },
  });

  if (loginRes.status !== 200) {
    console.log('❌ LOGIN ERROR:', loginRes.status, loginRes.body);
  }

  sleep(1);
}
