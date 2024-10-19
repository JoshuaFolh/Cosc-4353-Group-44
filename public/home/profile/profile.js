const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the profile.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/profile.html');
});

// Handle form submission
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
        availability: req.body.availability // New field for the availability date
    };

    // Log the profile data to the console (or save it to a database)
    console.log(profileData);

    // Store the data in a database (this is just an example)
    // db.save(profileData); // Uncomment this line if using a database like MongoDB or MySQL

    // Send a response back to the client
    res.send('Profile submitted successfully!');

    // Optionally, you can redirect the user to another page:
    // res.redirect('/thank-you');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
