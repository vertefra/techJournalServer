/* Dependencies */
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
// const mongoose = require('mongoose');
// const path = require('path');
// const cors = require('cors');
// const passport = require('./config/passport')();

/* Database */
// const MONGODB_URI = process.env.MONGODB_URI;
// const db = mongoose.connection;

// mongoose.connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// db.on('open', () => {
//     console.log('Mongo is Connected')
// });

/* Middleware */
// app.use(cors());
// app.use(express.json());
// app.use(passport.initialize());

/* Controller */
app.get('/', (req, res) => {
    res.send('Hello World!');
});

/* Listener */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});