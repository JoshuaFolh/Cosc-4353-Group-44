const app = require('../index.js');
const request = require('supertest');
const mongoose = require('mongoose');
//const {MongoMemoryServer} = require('mongodb-memory-server');
//const testUserCollection = require('../models/userCredModel.js');

//let mongo;

beforeAll(async () => {
    await mongoose.disconnect();
    //mongo = await MongoMemoryServer.create();
    //const uri = mongo.getUri();
    //await mongoose.connect(uri);
})

afterAll(async () => {
    await mongoose.disconnect();
    //await mongo.stop();
})

describe('POST /find_events', () => {
    it('should match users to events based on their skills', async () => {
        const parcel = {
            user: "John Cena"
        };

        const response = await request(app)
            .post('/find_events')
            .send({parcel});

        const res = JSON.parse(response.text); //response.json does not work but this is close enough
        expect(res[0].name).toBe("Park Cleanup");
    });

    it('should fail to find a non-existent user', async () => {
        const parcel = {
            user: "jdoi2wjiodi23oidio23iodn32"
        };

        const response = await request(app)
            .post('/find_events')
            .send({parcel});

        expect(response.status).toBe(400);
    });
});
