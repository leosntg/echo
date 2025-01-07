import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
    ],
};

export default function () {
    const url = 'http://localhost:3000/api/postagens';
    const payload = JSON.stringify({
        conteudo: `Postagem de teste ${Math.random()}`,
    });
    const params = {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUB0ZXN0ZS5jb20iLCJub21lIjoiVXN1w6FyaW8gVGVzdGUiLCJpYXQiOjE3MzYyODY5MDl9.hzRej4JSkq6oaaAkOxPIy0nRqT5WkvhDygtPSW469UM`,
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status é 201': (r) => r.status === 201,
        'tempo de resposta menor que 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1);
}