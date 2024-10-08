const {
  authentification,
  restriction,
} = require("../controller/authController");
const {
  getUtilisateurId,
  getUtilisateursClient,
  modifierUtilisateur,
  supprimerUtilisateur,
} = require("../controller/utilisateurController");

const router = require("express").Router();

// route pour les utilisateur
router
  .route("/client")
  .get(authentification, restriction("admin"), getUtilisateursClient);
module.exports = router;
