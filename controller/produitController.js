const produit = require("../db/models/produit");
const catchAsync = require("../utils/catchAsync");

const creerProduit = catchAsync(async (req, res, next) => {
  const body = req.body;

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

  return res.status(201).json({
    status: "Success",
    data: nouveauProduit,
    message: "Produit creer avec succes",
  });
});

module.exports = { creerProduit };
