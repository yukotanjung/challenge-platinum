'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Galleries', {
      id_gallery: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      filepath: {
        type: Sequelize.TEXT
      },
      inputdate: {
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Galleries');
  }
};