const {
  authentification,
  restriction,
} = require("../controller/authController");

const {
  creerMethodeLivraison,
  getMethode,
  getMethodeId,
  modifierMethodeLivraison,
  supprimerMethodeLivraison,
} = require("../controller/methodeLivraisonController");

const router = require("express").Router();

// route pour les categories
router
  .route("/")
  .post(authentification, restriction("admin"), creerMethodeLivraison)
  .get(authentification, getMethode);

router
  .route("/:id")
  .get(authentification, getMethodeId)
  .patch(authentification, restriction("admin"), modifierMethodeLivraison)
  .delete(authentification, restriction("admin"), supprimerMethodeLivraison);

module.exports = router;
