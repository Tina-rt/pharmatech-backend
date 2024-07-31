const {
  inscription,
  connexion,
  miseAJourProfil,
} = require("../controller/authController");

const router = require("express").Router();

// route pour les Authentification
router.route("/inscription").post(inscription);
router.route("/connexion").post(connexion);
router.route("/misajour").put(miseAJourProfil);

module.exports = router;
