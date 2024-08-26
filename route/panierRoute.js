const {
  authentification,
  restriction,
} = require("../controller/authController");
const {
  ajouterAuPanier,
  mettreAJourQuantite,
  supprimerDuPanier,
  getPanier,
  validerPanier,
  fermerPanier,
} = require("../controller/panierController");

const router = require("express").Router();

// route pour les Produits

router.route("/").get(authentification, getPanier);

router
  .route("/:id")
  .post(authentification, ajouterAuPanier)
  .patch(authentification, mettreAJourQuantite)
  .delete(authentification, supprimerDuPanier);

router.route("/valider").get(authentification, validerPanier);
router.route("/fermer").get(authentification, fermerPanier);

module.exports = router;
