const methodeLivraison = require("../db/models/methodelivraison");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Créer Methode Livraison
const creerMethodeLivraison = catchAsync(async (req, res, next) => {
  const body = req.body;

  const methodeLivraisonExistant = await methodeLivraison.findOne({
    where: { nom: body.nom },
  });
  if (methodeLivraisonExistant) {
    return next(
      new AppError("Un methode de livraison avec ce nom existe déjà", 400)
    );
  }

  const nouvelleMethode = await methodeLivraison.create({
    nom: body.nom,
    description: body.description,
    prix: body.prix,
  });

  if (!nouvelleMethode) {
    return next(new AppError("Impossible de créer la catégorie", 400));
  }

  return res.status(201).json({
    status: "Success",
    data: nouvelleMethode,
    message: "Methode de livraison créée avec succès",
  });
});

// Lire toutes les methode de livraison
const getMethode = catchAsync(async (req, res, next) => {
  const resultat = await methodeLivraison.findAll();

  return res.json({
    status: "success",
    data: resultat,
    message: "Voici la liste de toutes les liste de methode de livraison",
  });
});

// Lire une Methode de livraison par ID
const getMethodeId = catchAsync(async (req, res, next) => {
  const MethodeId = req.params.id;

  const resultat = await methodeLivraison.findByPk(MethodeId);

  if (!resultat) {
    return next(new AppError("ID Methode livraison introuvable", 400));
  }
  return res.json({
    status: "success",
    data: resultat,
    message: "Voici la catégorie",
  });
});

// Modifier livraison
const modifierMethodeLivraison = catchAsync(async (req, res, next) => {
  const MethodeId = req.params.id;
  const body = req.body;

  const resultat = await methodeLivraison.findOne({
    where: { id: MethodeId },
  });

  if (!resultat) {
    return next(new AppError("C'est pas la bonne methode de livraison", 400));
  }

  resultat.nom = body.nom;
  resultat.description = body.description;
  resultat.prix = body.prix;
  const resultatModifier = await resultat.save();

  return res.json({
    status: "success",
    data: resultatModifier,
    message: "Catégorie modifiée avec succès",
  });
});

// Supprimer une Methode de livraison
const supprimerMethodeLivraison = catchAsync(async (req, res, next) => {
  const MethodeID = req.params.id;

  const resultat = await methodeLivraison.findOne({
    where: { id: MethodeID },
  });

  if (!resultat) {
    return next(new AppError("ID Methode livraison invalide", 400));
  }

  await resultat.destroy();

  return res.json({
    status: "success",
    message: "Methode de livraison supprimée avec succès",
  });
});

module.exports = {
  creerMethodeLivraison,
  getMethode,
  getMethodeId,
  modifierMethodeLivraison,
  supprimerMethodeLivraison,
};
