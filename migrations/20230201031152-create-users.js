'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      fullname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email:{
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      input_date: {
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};