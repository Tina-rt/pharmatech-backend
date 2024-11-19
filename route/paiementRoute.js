const {
    authentification,
    restriction,
} = require("../controller/authController");

const {
    creerPaiement,
    getPaiementByCommandeId,
} = require("../controller/paiementController");

const router = require("express").Router();

router.route("/").post(authentification, creerPaiement);
router
    .route("/commande/:id")
    .get(authentification, restriction("admin"), getPaiementByCommandeId);
module.exports = router;
