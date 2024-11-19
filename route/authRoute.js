const {
  inscription,
  connexion,
  deconnexion,
  motdepasseoublie,
  connexionAdmin
} = require("../controller/authController");

const router = require("express").Router();

// route pour les Authentification
router.route("/inscription").post(inscription);
router.route("/connexion").post(connexion);
router.route('/connexion/admin').post(connexionAdmin);
router.route("/deconnexion").post(deconnexion);
router.route("/motdepasseoublie").post(motdepasseoublie);
module.exports = router;
