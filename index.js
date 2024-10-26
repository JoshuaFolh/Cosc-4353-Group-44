const express = require('express'); 
const cors = require('cors');
const pq = require('js-priority-queue');
const PriorityQueue = require('js-priority-queue');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.static('public')); 
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('good');
});

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
});


// Events route to render events dynamically
app.get('/events', async (req, res) => {
    try {
      const events = await Event.find(); // Fetch all events from MongoDB
      res.render('events', { events }); // Render events.ejs with event data
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving events');
    }
  });

app.get('/notifs_update', (req, res) => {
    res.status(200).json({notifs: ['THIS IS SAMPLE TEXT 1!', 'THIS IS SAMPLE TEXT 2!', 'THIS IS SAMPLE TEXT 3!']});
});



const volunteersJSON = JSON.parse('[{"name": "John Cena", "skills": ["Physical Work", "Acting"]}, {"name": "Confucius", "skills": ["Philosophy"]}]');
const eventsJSON = JSON.parse('[{"name": "Park Cleanup", "skills": ["Physical Work", "Cleaning"]}, {"name": "Volunteer at Soup Kitchen", "skills": ["Cooking", "Cleaning"]}, {"name": "Debating the Morals and Ethics of Modernity and Society", "skills": ["Philosophy", "Public Speaking"]}]');

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
    }

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

app.post('/login', (req, res) => {
    const {parcel} = req.body;
    //console.log(parcel.user);
    if (parcel.user == "admin" && parcel.pass == "admin") { 
        res.status(200).json({auth: 'valid'});
    }
    else {
        res.status(200).json({auth: 'invalid'});
    }
});

app.post('/registration', (req, res) => {
    const {parcel} = req.body;
    //console.log(parcel.user);
    if (parcel.user != "admin") { 
        res.status(200).json({auth: 'valid'});
    }
    else {
        res.status(200).json({auth: 'invalid'});
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
    res.statusCode(200).JSON({status: 'good'});
})

app.post('/submit-profile', (req, res) => {
    const profileData = {
        fullName: req.body.fullName,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        zipCode: req.body.zipCode,
        preference: req.body.preference,
        stateSel: req.body.stateSel,
        skills: req.body.skills, // This will be an array if multiple values are selected
        availability: req.body.availability
    };

    // Log the profile data to the console (or save it to a database)
    console.log(profileData);

    // Store the data in a database (this is just an example)

    // Send a response back to the client
    res.statusCode(200).JSON({status: 'good'});

});

app.listen(3000, () => console.log('App available on http://localhost:3000')); //tell the app to listen on port 3000