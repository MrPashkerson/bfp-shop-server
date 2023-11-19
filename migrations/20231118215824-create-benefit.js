'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Benefits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      benefit_name: {
        type: Sequelize.STRING,
      },
      benefit_type: {
        type: Sequelize.STRING,
      },
      benefit_category: {
        type: Sequelize.STRING,
      },
      benefit_description: {
        type: Sequelize.STRING(2048),
      },
      price: {
        type: Sequelize.INTEGER,
      },
      vendor_code: {
        type: Sequelize.STRING,
      },
      benefit_image: {
        type: Sequelize.STRING(2048),
      },
      in_stock: {
        type: Sequelize.BOOLEAN,
      },
      bestseller: {
        type: Sequelize.BOOLEAN,
      },
      new: {
        type: Sequelize.BOOLEAN,
      },
      popularity: {
        type: Sequelize.INTEGER,
      },
      info: {
        type: Sequelize.STRING(2048),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Benefits');
  },
};
