const express = require('express');
const partnerControllers = require('../controllers/partnerControllers');
const partnerImageControllers = require('../controllers/partnerImageControllers')
const router = express.Router();

router
  .route('/')
    .get(partnerControllers.getAllPartners)

router
  .route("/create")
    .get(partnerControllers.getCreatePartner)
    .post(partnerControllers.uploadPartnerImage, partnerControllers.postCreatePartner, partnerImageControllers.createPartnerImage);
    
router
  .route("/:id")
    .get(partnerControllers.getPartnerByPk)
    .post(partnerControllers.deletePartner)

router
  .route('/:id/delete')
    .post(partnerControllers.deletePartner);


module.exports = router;
