const {
  authentification,
  restriction,
} = require("../controller/authController");

const {
  creerLivraison,
  getLivraisonsParCommande,
  mettreAJourStatutLivraison,
  upload,
  getToutesLivraisons,
} = require("../controller/livraisonController");

const router = require("express").Router();

// route pour les categories
router
  .route("/")
  .post(authentification, upload.single("prescription"), creerLivraison)
  .get(authentification, getToutesLivraisons);

router
  .route("/:id")
  .get(authentification, getLivraisonsParCommande)
  .patch(authentification, mettreAJourStatutLivraison);

module.exports = router;
