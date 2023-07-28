const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const partnerImageModel = sequelize.define('PartnerImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return partnerImageModel;
}
