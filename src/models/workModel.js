const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const workModel = sequelize.define("Work", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return workModel;
}
