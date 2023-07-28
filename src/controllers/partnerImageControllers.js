const Partner = require('../models/index').models.Partner;
const PartnerImage = require('../models/index').models.PartnerImage;
const multer = require('multer');

const db = require('../models');

exports.createPartnerImage = async(req, res) => {
  try {
    const { path } = req.file;
    let newPartner = req.partner;
    let newPartnerImage = PartnerImage.build({
      image: path
    });


    newPartnerImage = await newPartnerImage.save();


    await newPartner.setPartnerImage(newPartnerImage);
    await newPartnerImage.setPartner(newPartner);

    res
      .status(201)
      .redirect(`/admin/partner/${newPartner.id}`)
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

async function getAllPartnerImages(req, res) {
  try {
    const partnerImages = await db.models.PartnerImage.findAll();
    res.json(partnerImages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve partner images.' });
  }
}

async function getPartnerImageById(req, res) {
  const partnerImageId = req.params.id;
  try {
    const partnerImage = await db.models.PartnerImage.findByPk(partnerImageId);
    if (!partnerImage) {
      return res.status(404).json({ error: 'Partner image not found.' });
    }
    res.json(partnerImage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the partner image.' });
  }
}

async function updatePartnerImage(req, res) {
  const partnerImageId = req.params.id;
  const partnerImageData = req.body;
  try {
    const partnerImage = await db.models.PartnerImage.findByPk(partnerImageId);
    if (!partnerImage) {
      return res.status(404).json({ error: 'Partner image not found.' });
    }
    await partnerImage.update(partnerImageData);
    res.json(partnerImage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the partner image.' });
  }
}

async function deletePartnerImage(req, res) {
  const partnerImageId = req.params.id;
  try {
    const partnerImage = await db.models.PartnerImage.findByPk(partnerImageId);
    if (!partnerImage) {
      return res.status(404).json({ error: 'Partner image not found.' });
    }
    await partnerImage.destroy();
    res.json({ message: 'Partner image deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the partner image.' });
  }
}
