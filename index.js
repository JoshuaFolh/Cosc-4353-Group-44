const express = require('express'); //we're using express.js
const app = express();
app.use(express.static('public')); //tell the app that the frontend is in the 'public' folder so it knows what to display
app.use(express.json()); //tell the app that we will be passing information in JSON format

//GET REQUEST
//used to pass information from the server to the frontend
//for the login page it's not used
//i've read that you can just use POST instead of GET and it's fine most of the time so it's probably ok for anything we're doing
//but idk
app.get('/', (req, res) => {
    res.status(200).send('good');
});

//POST REQUEST
//used to submit forms and modify server-side data
app.post('/', (req, res) => {
    const {parcel} = req.body; //set parcel to be the request information
    console.log(parcel.user);
    if (parcel.user == "admin" && parcel.pass == "admin") { //authentication; send response to frontend afterwards
        res.status(200).json({auth: 'correct'});
    }
    else {
        res.status(200).json({auth: 'incorrect'});
    }
});

app.listen(3000, () => console.log('App available on http://localhost:3000')); //tell the app to listen on port 3000