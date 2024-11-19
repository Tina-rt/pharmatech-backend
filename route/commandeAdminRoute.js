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
	getCommandesById
} = require("../controller/commandeController");

const router = require("express").Router();

// route pour les Produits

router
    .route("/")
    .post(authentification, creerCommande)
    .get(authentification, restriction("admin"), getCommandesUtilisateurs);

router
    .route("/:id")
    .patch(authentification, restriction("admin"), mettreAJourStatutCommande)
    .get(authentification,restriction("admin"), getCommandesById)
    .delete(authentification,restriction("admin"), supprimerCommandesUtilisateurId);

module.exports = router;
