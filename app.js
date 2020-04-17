const express = require('express');
const path = require('path');
const bodyPaser = require('body-parser')
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connect to Database
mongoose.connect(config.database);

//On Connecton
mongoose.connection.on('connected', () => {
    console.log('Connected to database '+config.database);
});

//On Error
mongoose.connection.on('error', (err) => {
    console.log('Database eroor '+err);
});

const app = express();

const users = require('./routes/users');

//port number
const port = 3000;

//cors middleware
app.use(cors());

//Set static Folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyPaser.json());

//Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

//index route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
    
});

//start server
app.listen(port, () => {
    console.log('server started on port '+port);
});
