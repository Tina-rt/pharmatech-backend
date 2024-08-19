const {
  authentification,
  restriction,
} = require("../controller/authController");
const { creerCategorie } = require("../controller/categorieController");
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

// route pour les categories
router
  .route("/creerCategorie")
  .post(authentification, restriction("admin"), creerCategorie);

module.exports = router;
