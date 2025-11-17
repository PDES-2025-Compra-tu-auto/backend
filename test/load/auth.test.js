import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    stages: [
        { duration: '30s', target: 10 },   
        { duration: '45s', target: 50 },     
        { duration: '1m', target: 120 },
        { duration: '45s', target: 50 },    
        { duration: '30s', target: 0 },   
    ],
};
const host = { 
    url: __ENV.HOST_URL || 'http://localhost',
    port: __ENV.HOST_PORT || '4000',
    toString: function() {
        return `${this.url}:${this.port}/api`;
    }
};

const requestEndpoint = (method, route, desc, sleepSec = 1, body = null, params = {}) => {
    const res = http.request(method, `${host.toString()}${route}`, body, params);
    console.log(`${desc} status: ${res.status}`);
    const success= check(res, { [`${desc} OK`]: (r) => r.status >= 200 && r.status < 300 });
    if( !success) {
      console.error(`${desc} failed with status ${res.status} and body: ${res.body}`);
    }
    sleep(sleepSec);
};

export default function () {
    sleep(10)
    const emailreg = `user_${uuidv4()}@test.com`;
    const passwordreg = 'Test1234!';
    const role = randomItem(['BUYER', 'CONCESIONARY']);
    const loginReq = {email: 'buyer@example.com', password: '12345678'};
    const registerBody = {
        fullname: 'Test User',
        email:emailreg,
        password:passwordreg,
        role,
    };

    if (role === 'CONCESIONARY') {
        registerBody.concesionaryCuit = `20${Math.floor(100000000 + Math.random() * 900000000)}`; 
    }

    const headers = { 'Content-Type': 'application/json' };
    const loginPayload = JSON.stringify(loginReq);

    requestEndpoint(
        'POST',
        '/auth/register',
        'User Registration',
        1,
        JSON.stringify(registerBody),
        { headers }
    );

    requestEndpoint(
        'POST',
        '/auth/login',
        'User Login',
        1,
        loginPayload,
        { headers }
    );
}
