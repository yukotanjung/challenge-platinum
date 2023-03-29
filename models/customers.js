'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customers.init({
    customer_id: {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement: true,
    },
    fullname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.DATE,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customers',
  });
  return Customers;
};