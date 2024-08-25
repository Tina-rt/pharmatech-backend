const {
  inscription,
  connexion,
  deconnexion,
} = require("../controller/authController");

const router = require("express").Router();

// route pour les Authentification
router.route("/inscription").post(inscription);
router.route("/connexion").post(connexion);
router.route("/deconnexion").post(deconnexion);
module.exports = router;
