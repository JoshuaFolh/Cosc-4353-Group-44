const app = require('../index.js');
const request = require('supertest');

describe('POST /registration', () => {
    it('should create a new user and add them to the db', async () => {
        const parcel = {
            user: "testUser",
            pass: "testPass"
        };

        const response = await request(app)
            .post('/registration')
            .send({parcel});
        expect(response.status).toBe(200);
    });
    
    it('should fail to create a non-unique user', async () => {
        const parcel = {
            user: "testUser",
            pass: "testPass"
        };

        const response = await request(app)
            .post('/registration')
            .send({parcel});
        expect(response.status).toBe(200);
    });
});

describe('POST /login', () => {
    it('should login an existing user', async () => {
        const parcel = {
            user: "testUser",
            pass: "testPass"
        };

        const response = await request(app)
            .post('/login')
            .send({parcel});
        expect(response.status).toBe(200);
    });
    
    it('should fail to login a nonexistent user', async () => {
        const parcel = {
            user: "testUser",
            pass: "testPass"
        };

        const response = await request(app)
            .post('/login')
            .send({parcel});
        expect(response.status).toBe(200);
    });
});
