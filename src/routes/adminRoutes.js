const express = require('express');
const adminControllers = require('../controllers/adminControllers');
const router = express.Router();
const authMiddlewares = require('../middlewares/authMiddlewares');
const authControllers = require('../controllers/authControllers');
const workRoutes = require('./workRoutes');
const partnerRoutes = require('./partnerRoutes');



router
  .route('/admin')
    .get(authMiddlewares.isAuthenticated, adminControllers.indexController);

router
  .route('/admin/login')
    .get(authMiddlewares.redirectIfNotAuthenticated, adminControllers.adminLoginGetController)
    .post(authMiddlewares.limitLoginAttempts, adminControllers.adminLoginPostController);

router
  .route('/admin/logout')
    .get(authControllers.logout);


router.use('/admin/work', authMiddlewares.isAuthenticated, workRoutes)
router.use('/admin/partner', authMiddlewares.isAuthenticated, partnerRoutes)

module.exports = router;
