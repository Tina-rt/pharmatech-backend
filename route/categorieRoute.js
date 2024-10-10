const {
  authentification,
  restriction,
} = require("../controller/authController");

const {
  creerCategorie,
  getCategories,
  getCategorieId,
  modifierCategorie,
  supprimerCategorie,
} = require("../controller/categorieController");

const router = require("express").Router();

// route pour les categories
router
  .route("/")
  .post(authentification, restriction("admin"), creerCategorie)
  .get(getCategories);

router
  .route("/:id")
  .get(getCategorieId)
  .patch(authentification, restriction("admin"), modifierCategorie)
  .delete(authentification, restriction("admin"), supprimerCategorie);

module.exports = router;
