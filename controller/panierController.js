const panier = require("../db/models/panier");
const panierProduit = require("../db/models/panierproduit");
const produit = require("../db/models/produit");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Ajouter un produit au panier
const ajouterAuPanier = catchAsync(async (req, res, next) => {
  const body = req.body; // Extraction des données du corps de la requête
  const utilisateurId = req.utilisateur.id; // ID de l'utilisateur authentifié
  const produitId = req.params.id; // ID du produit à ajouter au panier

  console.log("Produit ID:", produitId);
  console.log("Corps de la requête:", body);

  // 1. Vérification de la quantité
  const quantite = body.quantite;
  if (quantite === undefined || typeof quantite !== "number" || quantite <= 0) {
    return next(new AppError("La quantité doit être un nombre positif", 400));
  }

  // 2. Vérifier si le produit existe
  const produitExistant = await produit.findOne({
    where: { id: produitId },
  });
  if (!produitExistant) {
    return next(new AppError("Produit introuvable", 404));
  }

  // 3. Vérifier si un panier actif existe pour l'utilisateur
  let panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId, statut: "actif" },
  });

  // 4. Créer un nouveau panier si nécessaire
  if (!panierExistant) {
    panierExistant = await panier.create({
      utilisateur_id: utilisateurId,
      statut: "actif",
    });
  }

  // 5. Vérifier si le produit est déjà dans le panier
  let panierProduitExistant = await panierProduit.findOne({
    where: { panier_id: panierExistant.id, produit_id: produitId },
  });

  if (panierProduitExistant) {
    // 6. Mettre à jour la quantité du produit dans le panier
    panierProduitExistant.quantite += quantite;
    await panierProduitExistant.save();
  } else {
    // 7. Ajouter le produit au panier
    panierProduitExistant = await panierProduit.create({
      panier_id: panierExistant.id,
      produit_id: produitId,
      quantite: quantite,
      prix_unitaire: produitExistant.prix,
    });
  }

  console.log(`Produit ID: ${produitId}, Quantité ajoutée: ${quantite}`);

  return res.status(201).json({
    status: "Success",
    data: panierProduitExistant,
    message: "Produit ajouté au panier avec succès",
  });
});

// Lire le contenu du panier
const getPanier = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;

  const panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId, statut: "actif" },
  });

  if (!panierExistant) {
    return next(new AppError("Vous n'avez pas de panier actif", 400));
  }

  const panierProduits = await panierProduit.findAll({
    where: { panier_id: panierExistant.id },
    include: [
      {
        model: produit,
        attributes: ["id", "nom", "prix", "image", "tva_pourcentage"],
      },
    ],
  });

  // Initialiser les totaux
  let totalSansTVA = 0;
  let totalTVA = 0;
  let totalAvecTVA = 0;

  // Calculer le prix total avec TVA pour chaque produit
  const produitsAvecTVA = panierProduits.map((item) => {
    const prixTotal = item.quantite * item.produit.prix;
    const prixTVA = prixTotal * (item.produit.tva_pourcentage / 100);
    const prixTotalAvecTVA = prixTotal + prixTVA;

    // Ajouter aux totaux
    totalSansTVA += prixTotal;
    totalTVA += prixTVA;
    totalAvecTVA += prixTotalAvecTVA;

    return {
      id: item.produit.id,
      nom: item.produit.nom,
      image: item.produit.image,
      prix_unitaire: item.produit.prix,
      quantite: item.quantite,
      TVA: item.produit.tva_pourcentage,
      prix_total: prixTotal.toFixed(2),
      prix_TVA: prixTVA.toFixed(2),
      prix_total_avec_TVA: prixTotalAvecTVA.toFixed(2),
    };
  });

  return res.status(200).json({
    status: "success",
    data: produitsAvecTVA,
    total_panier: {
      statut: panierExistant.statut,
      total_sans_TVA: totalSansTVA.toFixed(2),
      total_TVA: totalTVA.toFixed(2),
      total_avec_TVA: totalAvecTVA.toFixed(2),
    },
    message: "Voici le contenu de votre panier",
  });
});

const getTousPanier = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;

  const panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId },
  });

  if (!panierExistant) {
    return next(new AppError("Vous n'avez pas de panier", 400));
  }

  const panierProduits = await panierProduit.findAll({
    where: { panier_id: panierExistant.id },
    include: [
      {
        model: produit,
        attributes: ["id", "nom", "prix", "image", "tva_pourcentage"],
      },
    ],
  });

  // Initialiser les totaux
  let totalSansTVA = 0;
  let totalTVA = 0;
  let totalAvecTVA = 0;

  // Calculer le prix total avec TVA pour chaque produit
  const produitsAvecTVA = panierProduits.map((item) => {
    const prixTotal = item.quantite * item.produit.prix;
    const prixTVA = prixTotal * (item.produit.tva_pourcentage / 100);
    const prixTotalAvecTVA = prixTotal + prixTVA;

    // Ajouter aux totaux
    totalSansTVA += prixTotal;
    totalTVA += prixTVA;
    totalAvecTVA += prixTotalAvecTVA;

    return {
      id: item.produit.id,
      nom: item.produit.nom,
      image: item.produit.image,
      prix_unitaire: item.produit.prix,
      quantite: item.quantite,
      TVA: item.produit.tva_pourcentage,
      prix_total: prixTotal.toFixed(2),
      prix_TVA: prixTVA.toFixed(2),
      prix_total_avec_TVA: prixTotalAvecTVA.toFixed(2),
    };
  });

  return res.status(200).json({
    status: "success",
    data: produitsAvecTVA,
    total_panier: {
      statut: panierExistant.statut,
      total_sans_TVA: totalSansTVA.toFixed(2),
      total_TVA: totalTVA.toFixed(2),
      total_avec_TVA: totalAvecTVA.toFixed(2),
    },
    message: "Voici tous les paniers",
  });
});

// Mettre à jour la quantité d'un produit dans le panier
const mettreAJourQuantite = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;
  const produitId = req.params.id;
  const quantite = req.body.quantite;

  const panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId, statut: "actif" },
  });

  if (!panierExistant) {
    return next(new AppError("Vous n'avez pas de panier actif", 400));
  }

  const panierProduitExistant = await panierProduit.findOne({
    where: { panier_id: panierExistant.id, produit_id: produitId },
  });

  if (!panierProduitExistant) {
    return next(new AppError("Produit introuvable dans le panier", 400));
  }

  panierProduitExistant.quantite = quantite;
  await panierProduitExistant.save();

  return res.status(201).json({
    status: "success",
    message: "Quantité mise à jour avec succès",
  });
});

// Supprimer un produit du panier
const supprimerDuPanier = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;
  const produitId = req.params.id;

  const panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId, statut: "actif" },
  });

  if (!panierExistant) {
    return next(new AppError("Vous n'avez pas de panier actif", 400));
  }

  const panierProduitExistant = await panierProduit.findOne({
    where: { panier_id: panierExistant.id, produit_id: produitId },
  });

  if (!panierProduitExistant) {
    return next(new AppError("Produit introuvable dans le panier", 400));
  }

  await panierProduitExistant.destroy();
  return res.status(201).json({
    status: "success",
    message: "Produit supprimé du panier avec succès",
  });
});

// Valider le panier
const validerPanier = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;

  const panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId, statut: "actif" },
  });

  if (!panierExistant) {
    return next(new AppError("Vous n'avez pas de panier actif", 400));
  }

  panierExistant.statut = "valide";
  await panierExistant.save();

  return res.status(201).json({
    status: "success",
    message: "Panier validé avec succès",
  });
});

// Fermer le panier
const fermerPanier = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;

  const panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId, statut: "valide" },
  });

  if (!panierExistant) {
    return next(new AppError("Vous n'avez pas de panier valide", 400));
  }

  panierExistant.statut = "ferme";
  await panierExistant.save();

  return res.status(201).json({
    status: "success",
    message: "Panier fermé avec succès",
  });
});

// Vider le panier
const viderPanier = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;

  // Vérifier si un panier actif existe pour l'utilisateur
  const panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId, statut: "actif" },
  });

  if (!panierExistant) {
    return next(new AppError("Vous n'avez pas de panier actif à vider", 400));
  }

  // Supprimer tous les produits du panier
  await panierProduit.destroy({
    where: { panier_id: panierExistant.id },
  });

  // Supprimer le panier lui-même
  //await panier.destroy({
  //where: { id: panierExistant.id },
  //});

  return res.status(200).json({
    status: "success",
    message: "Le panier a été vidé avec succès",
  });
});

module.exports = {
  ajouterAuPanier,
  getPanier,
  getTousPanier,
  mettreAJourQuantite,
  supprimerDuPanier,
  validerPanier,
  fermerPanier,
  viderPanier,
};
