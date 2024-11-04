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
    await mongoose.disconnect();
    await mongo.stop();
})

describe('POST /profile', () => {
    it('should modify the CURRENTUSER details', async () => {
        await testUserCollection.create({
            username: "testUser",
            salt: "salt",
            hash: "hash",
            isAdmin: false,
            details: {}
        });
        const CURRENTUSER = await testUserCollection.findOne();
        app.setCurrentUser(CURRENTUSER);

        const parcel = {
            fullName: "test",
            address1: "test",
            address2: "test",
            city: "test",
            zipCode: "test",
            preference: "test",
            stateSel: "test",
            skills: ["test"],
            availability: "test"
        };

        const response = await request(app)
            .post('/profile')
            .send({parcel});
        expect(response.status).toBe(200);
        //console.log(CURRENTUSER);
        expect(CURRENTUSER.details.skills[0]).toBe("test");
    });
});
