const {
  inscription,
  connexion,
  deconnexion,
  motdepasseoublie,
} = require("../controller/authController");

const router = require("express").Router();

// route pour les Authentification
router.route("/inscription").post(inscription);
router.route("/connexion").post(connexion);
router.route("/deconnexion").post(deconnexion);
router.route("/motdepasseoublie").post(motdepasseoublie);
module.exports = router;
