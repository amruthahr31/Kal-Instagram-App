const express = require('express');
const app = express();
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

//First route
app.get('/', (req, res) => res.send('Hello world!'));

const port = 5002;
app.listen(port, () => console.log(`Server running on port ${port}`));


//Route for users , profile
app.use('/app/users', users);
app.use('/app/profile', profile);

//DB config

const db = require('./config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));