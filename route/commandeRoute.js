const {
  authentification,
  restriction,
} = require("../controller/authController");
const {
  creerCommande,
  getCommandesUtilisateur,
  mettreAJourStatutCommande,
  getCommandesUtilisateurId,
} = require("../controller/commandeController");

const router = require("express").Router();

// route pour les Produits

router
  .route("/")
  .post(authentification, creerCommande)
  .get(authentification, getCommandesUtilisateur);

router
  .route("/:id")
  .patch(authentification, mettreAJourStatutCommande)
  .get(authentification, getCommandesUtilisateurId);

module.exports = router;
