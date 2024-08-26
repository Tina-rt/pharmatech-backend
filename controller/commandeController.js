const panier = require("../db/models/panier");
const panierProduit = require("../db/models/panierproduit");
const produit = require("../db/models/produit");
const commande = require("../db/models/commande");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Créer une nouvelle commande
const creerCommande = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;

  // Trouver le panier actif de l'utilisateur
  const panierExistant = await panier.findOne({
    where: { utilisateur_id: utilisateurId, statut: "actif" },
  });

  if (!panierExistant) {
    return next(new AppError("Vous n'avez pas de panier actif", 400));
  }

  // Récupérer les produits du panier
  const panierProduits = await panierProduit.findAll({
    where: { panier_id: panierExistant.id },
    include: [
      {
        model: produit,
        attributes: ["nom", "prix", "tva_pourcentage", "quantite_stock"],
      },
    ],
  });

  if (panierProduits.length === 0) {
    return next(new AppError("Le panier est vide", 400));
  }

  // Vérifier la disponibilité des produits en stock
  for (const item of panierProduits) {
    const produitStock = await produit.findByPk(item.produit_id);
    if (item.quantite > produitStock.quantite_stock) {
      return next(
        new AppError(
          `La quantité demandée pour le produit ${produitStock.nom} dépasse le stock disponible`,
          400
        )
      );
    }
  }

  // Créer une commande
  const nouvelleCommande = await commande.create({
    utilisateur_id: utilisateurId,
    statut: "en cours",
    montant_total: panierProduits.reduce((acc, item) => {
      const prixTotal = item.quantite * item.produit.prix;
      const prixTVA = prixTotal * (item.produit.tva_pourcentage / 100);
      return acc + prixTotal + prixTVA;
    }, 0),
  });

  // Ajouter les produits à la commande
  await Promise.all(
    panierProduits.map((item) =>
      commandeProduit.create({
        commande_id: nouvelleCommande.id,
        produit_id: item.produit_id,
        quantite: item.quantite,
        prix_unitaire: item.produit.prix,
        prix_TVA: item.produit.prix * (item.produit.tva_pourcentage / 100),
      })
    )
  );

  // Mettre à jour le statut du panier
  panierExistant.statut = "commande";
  await panierExistant.save();

  return res.status(201).json({
    status: "success",
    data: nouvelleCommande,
    message: "Commande créée avec succès",
  });
});

/*                          Récupérer les commandes d'un utilisateur                     */
const getCommandesUtilisateur = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;

  const commandes = await commande.findAll({
    where: { utilisateur_id: utilisateurId },
    include: [{ model: panier }],
  });

  if (!commandes.length) {
    return next(new AppError("Aucune commande trouvée", 404));
  }

  return res.status(200).json({
    status: "success",
    data: commandes,
    message: "Voici les commandes de l'utilisateur",
  });
});

// Mettre à jour le statut d'une commande
const mettreAJourStatutCommande = catchAsync(async (req, res, next) => {
  const commandeId = req.params.id;
  const { statut } = req.body;

  if (
    !["en attente", "en cours", "expediee", "livree", "annulee"].includes(
      statut
    )
  ) {
    return next(new AppError("Statut invalide", 400));
  }

  const commandeExistante = await commande.findByPk(commandeId);

  if (!commandeExistante) {
    return next(new AppError("Commande introuvable", 404));
  }

  commandeExistante.statut = statut;
  await commandeExistante.save();

  return res.status(200).json({
    status: "success",
    message: "Statut de la commande mis à jour avec succès",
  });
});

module.exports = {
  creerCommande,
  getCommandesUtilisateur,
  mettreAJourStatutCommande,
};
