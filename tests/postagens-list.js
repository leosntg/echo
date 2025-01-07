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
    const params = {
        headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZUB0ZXN0ZS5jb20iLCJub21lIjoiVXN1w6FyaW8gVGVzdGUiLCJpYXQiOjE3MzYyODY5MDl9.hzRej4JSkq6oaaAkOxPIy0nRqT5WkvhDygtPSW469UM`,
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status é 200': (r) => r.status === 200,
        'tempo de resposta menor que 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1);
}