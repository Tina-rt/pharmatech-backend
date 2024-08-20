const {
  authentification,
  restriction,
} = require("../controller/authController");

const {
  creerProduit,
  getProduits,
  getProduitId,
  modifierProduit,
  supprimerProduit,
} = require("../controller/produitController");

const router = require("express").Router();

// route pour les Produits

router
  .route("/")
  .post(authentification, restriction("admin"), creerProduit)
  .get(authentification, getProduits);

router
  .route("/:id")
  .get(authentification, getProduitId)
  .patch(authentification, restriction("admin"), modifierProduit)
  .delete(authentification, restriction("admin"), supprimerProduit);

module.exports = router;
