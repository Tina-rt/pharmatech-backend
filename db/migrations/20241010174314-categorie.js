'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('categorie', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    });

    await queryInterface.changeColumn('categorie', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
