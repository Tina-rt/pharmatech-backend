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
router.route("/creerCategorie").post(creerCategorie);

module.exports = router;
