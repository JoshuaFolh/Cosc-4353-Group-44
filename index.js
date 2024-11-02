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
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.status(200).send('good');
});

mongoose.connect("mongodb://localhost:27017/Vol")
.then(() => {
    console.log("mongodb connected");
})
.catch(() => {
    console.log("failed");
});

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    skills: String,
    urgency: String,
    date: String,
});
  
const Event = mongoose.model('EventDetails', eventSchema);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine only for dynamic pages
app.set('view engine', 'ejs');

// Home route to serve static HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); //now all files that are static do not have to have the parent directory public when being linked: ex. to link to home.html, the absolute path is "/home/home.html" instead of "/public/home/home.html"


// Events route to render events dynamically
app.get('/events', async (req, res) => {
    try {
      const events = await Event.find(); // Fetch all events from MongoDB
      res.render('events', { events }); // Render events.ejs with event data  
      //above line also makes it so that when linking to events.ejs the extension is removed; ie we link to /events.
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving events');
    }
  });

  app.get('/redirect-to-event', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login/login.html');  // Redirect to login if no user is in session
    }
  
    if (req.session.user.isAdmin) {res.redirect('/event-manager');}  // Admin view
    else {res.redirect('/event-signup');}  // Regular user view
  });
  
  // Rendering for EJS views
  app.get('/event-manager', (req, res) => res.render('event_manager'));
  app.get('/event-signup', (req, res) => res.render('event_signup'));
  

app.get('/notifs_update', (req, res) => {
    res.status(200).json({notifs: ['THIS IS SAMPLE TEXT 1!', 'THIS IS SAMPLE TEXT 2!', 'THIS IS SAMPLE TEXT 3!']});
});

const volunteersJSON = JSON.parse('[{"name": "John Cena", "skills": ["Physical Work", "Acting"]}, {"name": "Confucius", "skills": ["Philosophy"]}]');
const eventsJSON = JSON.parse('[{"name": "Park Cleanup", "skills": ["Physical Work", "Cleaning"]}, {"name": "Volunteer at Soup Kitchen", "skills": ["Cooking", "Cleaning"]}, {"name": "Debating the Morals and Ethics of Modernity and Society", "skills": ["Philosophy", "Public Speaking"]}]');

//let eventsJSON;
/*await Event.find()
.then(res => {
    eventsJSON = res.toJSON();
})*/

app.post('/find_events', (req, res) => {
    const {parcel} = req.body;
    //check if user exists
    let found = false;
    let idx;
    for (const i in volunteersJSON) {
        if (volunteersJSON[i].name == parcel.user) {
            found = true;
            idx = i;
        }
    }

    //return if user not found
    if (!found) {
        res.status(200).json({status: 'no such user found!'});
    }//question from Joshua: because found is false by default, shouldn't the conditional be "if (found)" rather than "if (!found)"?
    //^^^ 'found' gets set to true if the requested user (parcel.user) is found within the database of volunteers (represented by volunteersJSON)

    //match to events
    //assign events points based on similarity in skills then add to pq
    const compareNums = function(a, b) {return b.points-a.points;};
    const pq = new PriorityQueue({comparator: compareNums});
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

    res.status(200).json(resultJSON);
});

const userCollection = require('./models/userCredModel.js');

app.post('/login', async(req, res) => {
    const {parcel} = req.body;
    //console.log(parcel.user);
    const document = await userCollection.findOne({username: parcel.user});
    if (document) {
        const salt = document.salt;
        const userHash = document.hash;
        crypto.pbkdf2(parcel.pass, salt, 100, 16, 'sha256', (err, key) => {
            if (err) { throw err; }
            if (userHash == key) {
                CURRENTUSER = document;
                //CURRENTUSER.save();
                res.status(200).json({auth: 'valid'});
            }
            else {
                res.status(400).json({auth: 'invalid'});
            }
        });
    }
    else {
        res.status(400).json({auth: 'invalid'});
    }
});

app.post('/registration', async(req, res) => {
    const {parcel} = req.body;
    console.log(parcel.user);
    const test = userCollection.findOne();
    console.log(test);
    const document = await userCollection.findOne({username: parcel.user});
    if (document) {
        res.status(400).json({auth: 'invalid'});
    }
    else {
        var buf = crypto.randomBytes(16);
        const salt = buf.toString('base64');
        //only 100 iterations because the unit tests break otherwise
        //and i will tear my hair out if i have to troubleshoot this for any longer
        //just switch between 100000/100 depending on whether or not it is actually being used normally or by Jest
        crypto.pbkdf2(parcel.pass, salt, 100, 16, 'sha256', async(err, key) => {
            if (err) { throw err; }
            await userCollection.create({
                username: parcel.user,
                salt: salt,
                hash: key,
                isAdmin: false,
                details: {}
            });
        })
        res.status(200).json({auth: 'valid'});
    }
});

app.post('/submit-create event', (req, res) => {
    const profileData = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        skills: req.body.skills,
        UrgencyForm: req.body.UrgencyForm
    };
    console.log(profileData);
    res.statusCode(200).json({status: 'good'});
})

app.post('/profile', async(req, res) => {
    const {parcel} = req.body;
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

    CURRENTUSER.details.fullname = profileData.fullName;
    CURRENTUSER.details.address1 = profileData.address1;
    CURRENTUSER.details.address2 = profileData.address2;
    CURRENTUSER.details.city = profileData.city;
    CURRENTUSER.details.zipcode = profileData.zipcode;
    CURRENTUSER.details.preference = profileData.preference;
    CURRENTUSER.details.state = profileData.state;
    CURRENTUSER.details.skills = profileData.skills;
    CURRENTUSER.details.availability = profileData.availability;

    res.status(200).json({status: 'good'});
});

module.exports = app;

app.listen(3000, () => console.log('App available on http://localhost:3000')); //tell the app to listen on port 3000