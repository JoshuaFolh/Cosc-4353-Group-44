const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('good');
});

app.post('/', (req, res) => {
    const {parcel} = req.body;
    console.log(parcel.user);
    if (parcel.user == "admin" && parcel.pass == "admin") {
        res.status(200).json({auth: 'correct'});
    }
    else {
        res.status(200).json({auth: 'incorrect'});
    }
});

app.listen(3000, () => console.log('App available on http://localhost:3000'));