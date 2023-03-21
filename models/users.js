'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    userid: {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    fullname: DataTypes.STRING,
    status: DataTypes.INTEGER,
    email: DataTypes.STRING,
    input_date : {
      type : DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()')
    }
  }, {
    sequelize,
    modelName: 'Users',
    timestamps: false
  });
  return Users;
};