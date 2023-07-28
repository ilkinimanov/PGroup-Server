const router = require('express').Router();
const workControllers = require('../controllers/workControllers');
const workImageControllers = require('../controllers/workImageControllers');


router
  .route('/create')
    .get(workControllers.getCreateWork)
    .post(workControllers.uploadWorkImage, workControllers.createWork, workImageControllers.createWorkImage);


router
  .route('/:id')
    .get(workControllers.getWorkById)
    .post(workControllers.deleteWorkById)

router
  .route('/')
    .get(workControllers.getAllWorks);


module.exports = router;
