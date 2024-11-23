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

// Importing required modules
const PDFDocument = require("pdfkit");
const fs = require("fs");

// Creating a new instance of PDFDocument class
const pdf = new PDFDocument();

// Piping the output stream to a file
// named "output.pdf"
pdf.pipe(fs.createWriteStream("output.pdf"));

// Setting the fill color to black and
// font size to 15
pdf.fillColor("black")
    .fontSize(12);

// Adding multiple lines of text to
// the document

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
            pdf.end();
        })
}

getUsers();
