const panier = require("../db/models/panier");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Créer Panier
const creerPanier = catchAsync(async (req, res, next) => {
  const body = req.body;
  const utilisateurId = req.utilisateur.id;

  const nouveauPanier = await panier.create({
    utilisateur_id: utilisateurId,
    statut: body.statut,
  });

  if (!nouveauPanier) {
    return next(new AppError("Impossible de créer le panier", 400));
  }
  return res.status(201).json({
    status: "Success",
    data: nouveauPanier,
    message: "Panier créé avec succès",
  });
});

// Lire tous les paniers
const getPaniers = catchAsync(async (req, res, next) => {
  const resultat = await panier.findAll({
    where: {
      utilisateur_id: utilisateurId,
    },
  });

  return res.json({
    status: "success",
    data: resultat,
    message: "Voici la liste de tous les paniers",
  });
});

// Lire un panier par ID
const getPanierId = catchAsync(async (req, res, next) => {
  const panierId = req.params.id;

  const resultat = await panier.findByPk(panierId);

  if (!resultat) {
    return next(new AppError("ID panier introuvable", 400));
  }
  return res.json({
    status: "success",
    data: resultat,
    message: "Voici le panier",
  });
});

// Modifier panier
const modifierPanier = catchAsync(async (req, res, next) => {
  const panierId = req.params.id;
  const body = req.body;

  const resultat = await panier.findOne({
    where: { id: panierId },
  });

  if (!resultat) {
    return next(new AppError("C'est pas le bon panier", 400));
  }

  resultat.statut = body.statut;

  const resultatModifier = await resultat.save();

  return res.json({
    status: "success",
    data: resultatModifier,
    message: "Panier modifié avec succès",
  });
});

// Supprimer un panier
const supprimerPanier = catchAsync(async (req, res, next) => {
  const panierID = req.params.id;

  const resultat = await panier.findOne({
    where: { id: panierID },
  });

  if (!resultat) {
    return next(new AppError("ID panier invalide", 400));
  }

  await resultat.destroy();

  return res.json({
    status: "success",
    message: "Panier supprimé avec succès",
  });
});

module.exports = {
  creerPanier,
  getPaniers,
  getPanierId,
  modifierPanier,
  supprimerPanier,
};
