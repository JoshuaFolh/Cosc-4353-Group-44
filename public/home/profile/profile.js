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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
