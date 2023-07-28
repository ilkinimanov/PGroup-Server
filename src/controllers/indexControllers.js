const nodemailer = require('nodemailer');
const Partner = require('../models').models.Partner;
const PartnerImage = require('../models').models.PartnerImage;
const WorkImage = require('../models').models.WorkImage;
const { Sequelize } = require('sequelize');


exports.indexGet = async(req, res) => {
  const partners = await Partner.findAll({
    order: [['createdAt', 'DESC']],
    limit: 3,
    include: [ PartnerImage ]
  });
  const workImages = await WorkImage.findAll({
    order: Sequelize.literal('rand()'),
    limit: 5
  });

  res
    .status(200)
    .render('index', {
      partners: partners,
      workImages: workImages
    });
}

exports.indexPost = async(req, res) => {

  res
    .status(200)
    .redirect('/');
}
