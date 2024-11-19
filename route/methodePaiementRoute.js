const { authentification, restriction } = require("../controller/authController");
const {
    obtenirMethodePaiementById,
    obtenirToutesLesMethodesPaiement,
    mettreAJourMethodePaiement,
    supprimerMethodePaiement,
    creerMethodePaiement,
} = require("../controller/methodePaiementController");

const router = require("express").Router();

// route pour les paiements
router
    .route("/")
    .post(authentification, restriction("admin"), creerMethodePaiement)
    .get(obtenirToutesLesMethodesPaiement);

router
    .route("/:id")
    .get(obtenirMethodePaiementById)
    .patch(authentification, restriction("admin"), mettreAJourMethodePaiement)
    .delete(authentification, restriction("admin"), supprimerMethodePaiement);


module.exports = router;