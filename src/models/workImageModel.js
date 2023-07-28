const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const workImageModel = sequelize.define('WorkImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    image: {
      type: DataTypes.STRING,
    }
  });

  return workImageModel;
}
