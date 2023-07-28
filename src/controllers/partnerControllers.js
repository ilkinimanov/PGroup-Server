const Partner = require('../models').models.Partner;
const PartnerImage = require('../models').models.PartnerImage;
const multer = require('multer')
const path = require('path')
const fs = require('fs')


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { name } = req.body;
    const imagePath = `${process.cwd()}/src/public/uploads/partners/${name}`
    fs.mkdirSync(imagePath, { recursive: true });
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${file.originalname}`);
  }
})

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadPartnerImage = upload.single('image');


exports.postCreatePartner = async(req, res, next) => {
  const { name, description, startDate, stopDate, present, link } = req.body;

  if (!name || !description || !startDate) {
    res
      .status(400)
      .json({
        satus: "fail",
        description: "Partner must have name and description"
      })
  }
  const partnerConfig = {
    name: req.body.name,
    description: req.body.description,
    startDate: startDate,
  }
  if (present === 'on') {
    partnerConfig.present = true
  } else if (!stopDate) {
    res.status(500).json({ error: 'Failed to create a partner.' });
  } else {
    partnerConfig.stopDate = stopDate;
  }
  if (link) {
    partnerConfig.link = link;
  }
  try {
    const newPartner = Partner.build(partnerConfig);
    await newPartner.save();
    req.partner = newPartner;
    next();
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

exports.getCreatePartner = async(req, res) => {
  res
    .status(200)
    .render('admin/create-partner');
}

exports.getPartnerByPk = async(req, res) => {
  try {
    const id = req.params.id;
    const thePartner = await Partner.findByPk(id, {
      include: [ PartnerImage ]
    });
    if (!thePartner) {
      res
        .status(404)
        .send("Partner not found with id")
    }
    else {
      res
        .status(200)
        .render('admin/get-partner', {
          Partner: thePartner
        })
    }
  } catch(error) {
    res
      .status(500)
      .json({
        error: "Internal error"
      })
  }
}

exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll();
    res
      .status(200)
      .render('admin/get-all-partners');
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve partners.' });
  }
}

exports.deletePartner = async (req, res) => {
  const partnerId = req.params.id;
  try {
    const partner = await Partner.findOne({
      where: { id: partnerId }
    });

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    await partner.destroy();
    res
      .status(200)
      .redirect('/admin/partners');

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the partner.' });
  }
}
