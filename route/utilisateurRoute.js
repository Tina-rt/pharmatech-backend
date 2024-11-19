const {
    authentification,
    restriction,
} = require("../controller/authController");
const {
    getUtilisateurId,
    getUtilisateursClient,
    getUtilisateursAdmin,
    modifierUtilisateur,
    supprimerUtilisateur,
    creerUtilisateur,
    emailValid,
    modifyAdmin,
    exportClients,
} = require("../controller/utilisateurController");

const router = require("express").Router();

// route pour les utilisateur
router
    .route("/client")
    .get(authentification, restriction("admin"), getUtilisateursClient);

router
    .route("/export/client")
    .get(authentification, restriction("admin"), exportClients);

router.route("/profile").post(authentification, modifierUtilisateur);

router.route("/client/:id").get(authentification, getUtilisateurId);

router
    .route("/admin")
    .get(authentification, restriction("admin"), getUtilisateursAdmin)
    .patch(authentification, restriction("admin"), modifyAdmin)
    .post(authentification, restriction("admin"), creerUtilisateur);

router
    .route("/:id")
    .get(authentification, restriction("admin"), getUtilisateurId)
    .delete(authentification, restriction("admin"), supprimerUtilisateur);

router.route("/emailvalid").post(authentification, emailValid);

module.exports = router;
