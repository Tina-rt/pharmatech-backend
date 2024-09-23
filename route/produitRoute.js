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
  upload,
} = require("../controller/produitController");

const router = require("express").Router();

// route pour les Produits

router
  .route("/")
  .post(
    authentification,
    restriction("admin"),
    upload.single("image"),
    creerProduit
  )
  .get(getProduits);

router
  .route("/:id")
  .get(getProduitId)
  .patch(
    authentification,
    restriction("admin"),
    upload.single("image"),
    modifierProduit
  )
  .delete(authentification, restriction("admin"), supprimerProduit);

module.exports = router;
