require('dotenv').config({ path: './.env' });

const express = require('express');
const mongoose = require('mongoose');
const indexRoutes = require('./routes/indexRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorControllers = require('./controllers/errorControllers');
const path = require('path');
const db = require('./models');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const partnerRoutes = require('./routes/partnerRoutes');
const workRoutes = require('./routes/workRoutes');


const app = express();


// Logging
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

// JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// App routes
app.use(indexRoutes);
app.use(adminRoutes);


// Sync models
(async () => {
  await db.sequelize.sync({
    force: false,
    alter: true
  });
})();


app.all('/', errorControllers.error404);


module.exports = app;
