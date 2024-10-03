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
  getTousPanier,
  viderPanier,
} = require("../controller/panierController");

const router = require("express").Router();

// route pour les Produits

router.route("/").get(authentification, getPanier);
router.route("/valider").post(authentification, validerPanier);
router.route("/liste").get(authentification, getTousPanier);
router.route("/fermer").post(authentification, fermerPanier);
router.route("/vider").delete(authentification, viderPanier);

router
  .route("/:id")
  .post(authentification, ajouterAuPanier)
  .patch(authentification, mettreAJourQuantite)
  .delete(authentification, supprimerDuPanier);

module.exports = router;
