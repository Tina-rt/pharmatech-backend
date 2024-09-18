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
  getToutesLesLivraisonsProduitsParUtilisateur,
} = require("../controller/livraisonController");

const router = require("express").Router();

// route pour les categories
router
  .route("/")
  .post(authentification, upload.single("prescription"), creerLivraison)
  .get(authentification, getToutesLivraisons);

router
  .route("/liste")
  .get(
    authentification,
    restriction("admin"),
    getToutesLesLivraisonsProduitsParUtilisateur
  );
router
  .route("/:id")
  .get(authentification, getLivraisonsParCommande)
  .patch(authentification, mettreAJourStatutLivraison);

module.exports = router;
