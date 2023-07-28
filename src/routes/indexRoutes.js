const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/indexControllers');
const emailControllers = require('../controllers/emailControllers');


router
  .route('/')
    .get(indexControllers.indexGet)
    .post(emailControllers.sendEmail, indexControllers.indexPost);


module.exports = router;
