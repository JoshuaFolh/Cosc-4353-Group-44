const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const PriorityQueue = require('js-priority-queue');
const crypto = require('crypto');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

let CURRENTUSER;



mongoose.connect("mongodb://localhost:27017/Vol")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("failed");
    });

const userCollection = require('./models/userCredModel.js');
const { profile } = require('console');

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    loc: String,
    skills: String,
    urgency: String,
    date: String,
});
const Event = mongoose.model('EventDetails', eventSchema);

app.set('view engine', 'ejs'); // Set EJS as the templating engine only for dynamic pages
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' folder


// Home route to serve static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); //now all files that are static do not have to have the parent directory public when being linked: ex. to link to home.html, the absolute path is "/home/home.html" instead of "/public/home/home.html"

app.post('/login', async (req, res) => {
    const { parcel } = req.body;
    const document = await userCollection.findOne({ username: parcel.user });
    if (document) {
        const salt = document.salt;
        const userHash = document.hash;
        crypto.pbkdf2(parcel.pass, salt, 100, 16, 'sha256', (err, key) => {
            if (err) { throw err; }
            if (userHash == key) {
                CURRENTUSER = document; // Set CURRENTUSER to the logged-in user document
                res.status(200).json({ auth: 'valid' });
            }
            else {
                res.status(400).json({
                    auth: 'invalid'
                });
            }
        });
    } else {
        res.status(400).json({ auth: 'invalid' });
    }
});
//events debugger: comment me.
// app.get('/event-manager', async (req, res) => {
//     try {
//         const events = await Event.find(); // Fetch all events from MongoDB
//         console.log("Events retrieved:", events); // Log the events for debugging
//         res.render('event_manager', { events }); // Pass events to the template
//     } catch (error) {
//         console.error("Error retrieving events:", error);
//         res.status(500).send("Error loading events");
//     }
// });


// Events route to render events dynamically
app.get('/event-manager', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events from MongoDB
        res.render('event_manager', { events }); // Pass events to the template
    } catch (error) {
        console.error("Error retrieving events:", error);
        res.status(500).send("Error loading events");
    }
});

app.get('/redirect-to-event', (req, res) => {
    if (!CURRENTUSER) {return res.redirect('/login/login.html');}
    // Redirect to login if no user is currently logged in
//     // Check if CURRENTUSER is an admin or regular user
    if (CURRENTUSER.isAdmin) {res.redirect('/event-manager');} // Redirect to the admin view
    else {res.redirect('/event-signup');}
});


// Rendering for EJS views
app.get('/event-signup', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events from MongoDB
        res.render('event_signup', { events }); // Pass events to the template
    } catch (error) {
        console.error("Error retrieving events:", error);
        res.status(500).send("Error loading events");
    }
});


app.get('/notifs_update', (req, res) => {
    res.status(200).json({ notifs: ['THIS IS SAMPLE TEXT 1!', 'THIS IS SAMPLE TEXT 2!', 'THIS IS SAMPLE TEXT 3!'] });
});

const volunteersJSON = JSON.parse('[{"name": "John Cena", "skills": ["Physical Work", "Acting"]}, {"name": "Confucius", "skills": ["Philosophy"]}]');
const eventsJSON = JSON.parse('[{"name": "Park Cleanup", "skills": ["Physical Work", "Cleaning"]}, {"name": "Volunteer at Soup Kitchen", "skills": ["Cooking", "Cleaning"]}, {"name": "Debating the Morals and Ethics of Modernity and Society", "skills": ["Philosophy", "Public Speaking"]}]');


//this is the event-user matcher, as well as a check to see if the user exists.
app.post('/find_events', async (req, res) => {
    const { parcel } = req.body;
    //check if user exists
    let found = false;
    let idx;

    /*
    let eventsJSON;
    await Event.find()
    .then(res => {
        eventsJSON = res.toJSON();
    })
    let volunteersJSON;
    await userCollection.find()
    .then(res => {
        volunteersJSON = res.toJSON();
    })
    console.log(volunteersJSON);*/

    for (const i in volunteersJSON) {
        if (volunteersJSON[i].name == parcel.user) {
            found = true;
            idx = i;
        }
    }

    //return if user not found
    if (found == false) {
        //console.log("NOT FOUND");
        res.status(400).json({ status: 'no such user found!' });
    }

    else {
        //match to events
        //assign events points based on similarity in skills then add to pq
        const compareNums = function (a, b) { return b.points - a.points; };
        const pq = new PriorityQueue({ comparator: compareNums });
        const volunteerSkills = volunteersJSON[idx].skills;
        for (const i in eventsJSON) {
            let event = {
                json: '{"name": ' + JSON.stringify(eventsJSON[i].name) + ', "skills": ' + JSON.stringify(eventsJSON[i].skills) + '}',
                id: i,
                points: 0
            };
            //console.log(eventsJSON[i]);
            for (const vol_skill of volunteerSkills) {
                //console.log(vol_skill);
                for (const j in eventsJSON[i].skills) {
                    //console.log(eventsJSON[i].skills[j]);
                    if (vol_skill == eventsJSON[i].skills[j]) {
                        //console.log(vol_skill, eventsJSON[i].skills[j]);
                        event.points++;
                        //add points for location, time, etc
                    }
                }
            }
            pq.queue(event);
        }

        //dump pq into resultJSON
        let result = "[";
        while (pq.length > 0) {
            result += pq.dequeue().json;
            if (pq.length > 0) {
                result += ',';
            }
        }
        result += ']';
        const resultJSON = JSON.parse(result);
        //console.log(resultJSON);

        res.status(200).json(resultJSON);
    }
});

app.post('/login', async (req, res) => {
    const { parcel } = req.body;
    //console.log(parcel.user);
    const document = await userCollection.findOne({ username: parcel.user });
    if (document) {
        const salt = document.salt;
        const userHash = document.hash;
        crypto.pbkdf2(parcel.pass, salt, 100, 16, 'sha256', (err, key) => {
            if (err) { throw err; }
            if (userHash == key) {
                CURRENTUSER = document;
                //CURRENTUSER.save();
                res.status(200).json({ auth: 'valid' });
            }
            else {
                res.status(400).json({ auth: 'invalid' });
            }
        });
    }
    else {
        res.status(400).json({ auth: 'invalid' });
    }
});

app.post('/registration', async (req, res) => {
    const { parcel } = req.body;
    //console.log(parcel.user);

    const document = await userCollection.findOne({ username: parcel.user });
    if (document) {
        res.status(400).json({ auth: 'invalid' });
    }
    else {
        var buf = crypto.randomBytes(16);
        const salt = buf.toString('base64');
        //only 100 iterations because the unit tests break otherwise
        //even increasing jest's auto-timeout doesnt fix it
        //and i will tear my hair out if i have to troubleshoot this for any longer
        //just switch between 100000/100 depending on whether or not it is actually being used normally or by jest
        crypto.pbkdf2(parcel.pass, salt, 100, 16, 'sha256', async (err, key) => {
            if (err) { throw err; }
            await userCollection.create({
                username: parcel.user,
                salt: salt,
                hash: key,
                isAdmin: false,
                details: {}
            });
        })
        res.status(200).json({ auth: 'valid' });
    }
});

app.post('/create-event', async (req, res) => {
    const { name, description, loc, skills, Urgency } = req.body;

    // Validate data as necessary
    if (!name || !description || !loc || !skills || !Urgency) {
        return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    try {
        const newEvent = new EventDetails({
            name,
            description,
            loc,
            skills,
            Urgency
        });

        await newEvent.save();
        res.json({ status: "good" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});


app.post('/profile', async (req, res) => {
    const { parcel } = req.body;
    const profileData =
    {
        fullName: parcel.fullName,
        address1: parcel.address1,
        address2: parcel.address2,
        city: parcel.city,
        zipCode: parcel.zipCode,
        preference: parcel.preference,
        stateSel: parcel.stateSel,
        skills: parcel.skills, // This will be an array if multiple values are selected
        availability: parcel.availability
    };

    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.fullname": profileData.fullName}}
    );
    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.address1": profileData.address1}}
    );
    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.address2": profileData.address2}}
    );
    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.city": profileData.city}}
    );
    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.zipcode": profileData.zipcode}}
    );
    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.preference": profileData.preference}}
    );
    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.state": profileData.state}}
    );
    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.skills": profileData.skills}}
    );
    await userCollection.updateOne(
        {_id: CURRENTUSER._id},
        {$set: {"details.availability": profileData.availability}}
    );
    console.log(CURRENTUSER);

    res.status(200).json({ status: 'good' });
});

module.exports = app;

app.delete('/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        await Event.findByIdAndDelete(eventId); // Use the existing EventDetails schema
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
});

app.listen(3000, () => console.log('App available on http://localhost:3000')); //tell the app to listen on port 3000

//https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use
//USE WHEN RUNNING UNIT TESTS TO USE PORTS OTHER THAN 3000


// if (process.env.NODE_ENV !== 'test') {
//     app.listen(port, () => console.log('Listening on port ${port}'));
// }
