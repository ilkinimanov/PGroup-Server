const { Sequelize } = require('sequelize')
const dbConfig = require('../db/dbConfig');


const sequelize = new Sequelize(dbConfig.dbName, dbConfig.dbUser, dbConfig.dbPassword, {
  host: dbConfig.dbHost,
  dialect: dbConfig.dbDialect,
  logging: false
})

sequelize.authenticate()
  .then(() => {
    console.log("Connection is successful");
  })
  .catch(() => {
    console.log("Connection is not succesful");
  });


const db = {};
db.sequelize = sequelize;
db.models = {};


db.models.User = require('./userModel')(sequelize);
db.models.Partner = require('./partnerModel')(sequelize);
db.models.PartnerImage = require('./partnerImageModel')(sequelize);
db.models.Work = require('./workModel')(sequelize);
db.models.WorkImage = require('./workImageModel')(sequelize);


// Relations
// Partner - Partner Image
db.models.Partner.hasOne(db.models.PartnerImage, {
  onDelete: 'CASCADE'
});
db.models.PartnerImage.belongsTo(db.models.Partner, {
  onDelete: 'CASCADE'
});


// Work - Work Image
db.models.Work.hasMany(db.models.WorkImage, {
  onDelete: 'CASCADE'
});
db.models.WorkImage.belongsTo(db.models.Work, {
  onDelete: 'CASCADE'
});


module.exports = db;
