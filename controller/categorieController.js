const categorie = require("../db/models/categorie");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Créer Catégorie
const creerCategorie = catchAsync(async (req, res, next) => {
  const body = req.body;

  const categorieExistante = await categorie.findOne({
    where: { nom: body.nom },
  });
  if (categorieExistante) {
    return next(new AppError("Une catégorie avec ce nom existe déjà", 400));
  }

  const nouvelleCategorie = await categorie.create({
    nom: body.nom,
  });

  if (!nouvelleCategorie) {
    return next(new AppError("Impossible de créer la catégorie", 400));
  }
  console.log(body.nom);

  return res.status(201).json({
    status: "Success",
    data: nouvelleCategorie,
    message: "Catégorie créée avec succès",
  });
});

// Lire toutes les catégories
const getCategories = catchAsync(async (req, res, next) => {
  const resultat = await categorie.findAll();

  return res.json({
    status: "success",
    data: resultat,
    message: "Voici la liste de toutes les catégories",
  });
});

// Lire une catégorie par ID
const getCategorieId = catchAsync(async (req, res, next) => {
  const categorieId = req.params.id;

  const resultat = await categorie.findByPk(categorieId);

  if (!resultat) {
    return next(new AppError("ID catégorie introuvable", 400));
  }
  return res.json({
    status: "success",
    data: resultat,
    message: "Voici la catégorie",
  });
});

// Modifier catégorie
const modifierCategorie = catchAsync(async (req, res, next) => {
  const categorieId = req.params.id;
  const body = req.body;

  const resultat = await categorie.findOne({
    where: { id: categorieId },
  });

  if (!resultat) {
    return next(new AppError("C'est pas la bonne catégorie", 400));
  }

  resultat.nom = body.nom;
  resultat.description = body.description;

  const resultatModifier = await resultat.save();

  return res.json({
    status: "success",
    data: resultatModifier,
    message: "Catégorie modifiée avec succès",
  });
});

// Supprimer une catégorie
const supprimerCategorie = catchAsync(async (req, res, next) => {
  const categorieID = req.params.id;

  const resultat = await categorie.findOne({
    where: { id: categorieID },
  });

  if (!resultat) {
    return next(new AppError("ID catégorie invalide", 400));
  }

  await resultat.destroy();

  return res.json({
    status: "success",
    message: "Catégorie supprimée avec succès",
  });
});

module.exports = {
  creerCategorie,
  getCategories,
  getCategorieId,
  modifierCategorie,
  supprimerCategorie,
};
