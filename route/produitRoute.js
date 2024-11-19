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
    rechercherProduitParNom,
    getTopSellingProducts,
    getProduitByCatId,
    exportProduits,
} = require("../controller/produitController");

const router = require("express").Router();

// route pour les Produits
router.route("/recherche").get(rechercherProduitParNom);
router.route("/top").get(getTopSellingProducts);
router.route("/categorie/:catId").get(getProduitByCatId);
router
    .route("/")
    .post(
        authentification,
        restriction("admin"),
        upload.single("image"),
        creerProduit
    )
    .get(getProduits);
router.route("/export").get(authentification, restriction("admin"), exportProduits);
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
