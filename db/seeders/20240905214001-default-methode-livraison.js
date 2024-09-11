"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("methodeLivraison", [
      {
        nom: "Tarif Forfaitaire",
        description: "Livraison forfaitaire standard pour tous les articles",
        prix: 3000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nom: "Livraison Accélérée",
        description:
          "Livraison accélérée pour recevoir l'envoi en un jour ou deux",
        prix: 8000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nom: "Livraison en 24 Heures",
        description:
          "Une option coûteuse pour recevoir l'envoi le jour ouvrable suivant",
        prix: 10000.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("methodeLivraison", null, {});
  },
};
