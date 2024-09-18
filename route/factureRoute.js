const {
  authentification,
  restriction,
} = require("../controller/authController");

const {
  creerFacture,
  getFactureById,
  getFacturesUtilisateur,
  mettreAJourStatutFacture,
} = require("../controller/factureController");

const router = require("express").Router();

// route pour les categories
router
  .route("/")
  .post(authentification, creerFacture)
  .get(authentification, getFacturesUtilisateur);

router
  .route("/:id")
  .get(authentification, getFactureById)
  .patch(authentification, mettreAJourStatutFacture);

module.exports = router;
