"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("ADMIN_Ph@rmatech!", 10);

    await queryInterface.bulkInsert("utilisateur", [
      {
        nom: "ADMIN",
        prenom: "Admin",
        email: "rakotomaroharilala5@gmail.com",
        motdepasse: hashedPassword,
        phone: "0340417324",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "utilisateur",
      { email: "rakotomaroharilala5@gmail.com" },
      {}
    );
  },
};
