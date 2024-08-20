const produit = require("../db/models/produit");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//creer Produit
const creerProduit = catchAsync(async (req, res, next) => {
  const body = req.body;

  const produitExistant = await produit.findOne({
    where: { numero_serie: body.numero_serie },
  });
  if (produitExistant) {
    return next(
      new AppError("Un produit avec ce numero de serie existe déjà", 400)
    );
  }

  const nouveauProduit = await produit.create({
    nom: body.nom,
    description: body.description,
    prix: body.prix,
    stock: body.stock,
    image: body.image,
    categorie_id: body.categorie_id,
    marque: body.marque,
    numero_serie: body.numero_serie,
    caracteristique_principale: body.caracteristique_principale,
    reduction: body.reduction,
    tva_pourcentage: body.tva_pourcentage,
  });

  if (!nouveauProduit) {
    return next(new AppError(" Impossible de creer le produit", 400));
  }
  return res.status(201).json({
    status: "Success",
    data: nouveauProduit,
    message: "Produit creer avec succes",
  });
});

//Lire toutes produits

const getProduits = catchAsync(async (req, res, next) => {
  const resultat = await produit.findAll();

  delete resultat.deletedAt;
  return res.json({
    status: "success",
    data: resultat,
    message: "Voici la liste de tous les produits",
  });
});

//lire un produits par ID

const getProduitId = catchAsync(async (req, res, next) => {
  const produitId = req.params.id;

  const resultat = await produit.findByPk(produitId);

  if (!resultat) {
    return next(new AppError("ID produit introuvable ", 400));
  }
  return res.json({
    status: "success",
    data: resultat,
    message: "Voici le produit",
  });
});

//Modifier produit
const modifierProduit = catchAsync(async (req, res, next) => {
  const produitId = req.params.id;
  const body = req.body;

  const resultat = await produit.findOne({
    where: { id: produitId },
  });

  if (!resultat) {
    return next(new AppError("C'est pas le bon produit", 400));
  }

  resultat.nom = body.nom;
  resultat.description = body.description;
  resultat.prix = body.prix;
  resultat.stock = body.stock;
  resultat.image = body.image;
  resultat.categorie_id = body.categorie_id;
  resultat.marque = body.marque;
  resultat.numero_serie = body.numero_serie;
  resultat.caracteristique_principale = body.caracteristique_principale;
  resultat.reduction = body.reduction;
  resultat.tva_pourcentage = body.tva_pourcentage;

  const resultatModifier = await resultat.save();

  return res.json({
    status: "success",
    data: resultatModifier,
    message: "Produit modifier avec succes",
  });
});

//Supprimer un produit
const supprimerProduit = catchAsync(async (req, res, next) => {
  const produitID = req.params.id;
  const body = req.body;

  const resultat = await produit.findOne({
    where: { id: produitID },
  });

  if (!resultat) {
    return next(new AppError("ID produit invalide", 400));
  }

  await resultat.destroy();

  return res.json({
    status: "success",
    message: "Produit supprimer avec succes",
  });
});
module.exports = {
  creerProduit,
  getProduits,
  getProduitId,
  modifierProduit,
  supprimerProduit,
};