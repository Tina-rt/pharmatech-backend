const {
  authentification,
  restriction,
} = require("../controller/authController");
const { creerCategorie } = require("../controller/categorieController");
const { creerProduit } = require("../controller/produitController");

const router = require("express").Router();

// route pour les Produits

router
  .route("/creerProduit")
  .post(authentification, restriction("admin"), creerProduit);

// route pour les categories
router
  .route("/creerCategorie")
  .post(authentification, restriction("admin"), creerCategorie);

module.exports = router;
