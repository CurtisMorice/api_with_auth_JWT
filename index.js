const express = require('express');
const app = express()
require('dotenv').config()
const mongoose = require('mongoose');

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Connect to the DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => {
    console.log(`${ process.env.DB_USERNAME } Connected to the DB`);
  });

app.use(express.json());


//Route Middleware
app.use('/api/user', authRoute); // << /api/user/register or whatever the midlleware ios passing in .
app.use('/api/posts', postRoute);
app.listen(5000, () => console.log('Server is up and running'));
