const mongoose = require('mongoose');

const userCollection = require('./models/userCredModel.js');
//const eventCollection = require('./index.js');

mongoose.connect("mongodb://localhost:27017/Vol")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("failed");
    });

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'history', title: 'HISTORY'}
    ]
});

let data = [];
let userArr = [];

async function getUsers() {
    await userCollection.find({})
        .then(users => users.forEach(function(user) {
            userArr.push(user);
        }))
        .then(() => {
            for (const user of userArr) {
                let obj;
                obj = {
                    name: user.username,
                    history: user.volHistory
                }
                data.push(obj);
            }
        })
        .then(() => {
            csvWriter
                .writeRecords(data)
        })
        .then(() => {
            mongoose.disconnect();
        })
}

getUsers();