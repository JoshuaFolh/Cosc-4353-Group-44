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

const PDFDocument = require("pdfkit");
const fs = require("fs");

const pdf = new PDFDocument();

pdf.pipe(fs.createWriteStream("output.pdf"));

pdf.fillColor("black")
    .fontSize(12);

let userArr = [];

async function getUsers() {
    await userCollection.find({})
        .then(users => users.forEach(function(user) {
            userArr.push(user);
        }))
        .then(() => {
            for (const user of userArr) {
                pdf.text(user.username + "'s volunteer history:");
                pdf.text(user.volHistory + '\n');
            }
        })
        .then(() => {
            mongoose.disconnect();
            pdf.end();
        })
}

getUsers();

//probably need to export event schema from index.js
//but it would be better to just have it be a separate file...
/*
let eventArr = [];

async function getEvents() {
    await eventCollection.find({})
        .then(events => events.forEach(function(event) {
            eventArr.push(event);
        }))
        .then(() => {
            for (const event of eventArr) {
                pdf.text(event.username + '\n');
            }
        })
        .then(() => {
            pdf.end();
        })
}

getEvents();*/