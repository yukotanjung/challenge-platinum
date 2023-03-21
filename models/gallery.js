'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Gallery.init({
    id_gallery: {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
    },
    item_id: DataTypes.INTEGER,
    filepath: DataTypes.TEXT,
    inputdate: {
      type : DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {
    sequelize,
    modelName: 'Gallery',
    timestamps: false
  });
  return Gallery;
};