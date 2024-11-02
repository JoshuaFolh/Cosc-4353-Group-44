const app = require('../index.js');
const request = require('supertest');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const testUserCollection = require('../models/userCredModel.js');

let mongo;

beforeAll(async () => {
    await mongoose.disconnect();
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
})

afterAll(async () => {
    await mongoose.disconnect;
    await mongo.stop();
})

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
        
        const findUser = testUserCollection.findOne();
        expect(findUser).not.toBeNull();
    });
    
    it('should fail to create a non-unique user', async () => {
        const parcel = {
            user: "testUser",
            pass: "testPass"
        };

        const response = await request(app)
            .post('/registration')
            .send({parcel});
        expect(response.status).toBe(400);

        const findUser = testUserCollection.findOne({username: "testUser"});
        expect(findUser).not.toBeNull();
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
            user: "testUser1",
            pass: "testPass2"
        };

        const response = await request(app)
            .post('/login')
            .send({parcel});
        expect(response.status).toBe(400);
    });
});
