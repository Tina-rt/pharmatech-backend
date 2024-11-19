const {
  authentification,
  restriction,
} = require("../controller/authController");
const {
  creerCommande,
  getCommandesUtilisateur,
  mettreAJourStatutCommande,
  getCommandesUtilisateurId,
  supprimerCommandesUtilisateurId,
  getCommandesUtilisateurs,
  exportCommande,
} = require("../controller/commandeController");

const router = require("express").Router();

// route pour les Produits

router
  .route("/")
  .post(authentification, creerCommande)
  .get(authentification, getCommandesUtilisateur);

router
  .route("/liste")
  .get(authentification, restriction("admin"), getCommandesUtilisateurs);

router.route("/export").get(authentification, restriction('admin') , exportCommande);

router
  .route("/:id")
  .patch(authentification, mettreAJourStatutCommande)
  .get(authentification, getCommandesUtilisateurId)
  .delete(authentification, supprimerCommandesUtilisateurId);

module.exports = router;
