const { inscription, connexion } = require("../controller/authController");

const router = require("express").Router();

// route pour les Authentification
router.route("/inscription").post(inscription);
router.route("/connexion").post(connexion);

module.exports = router;
