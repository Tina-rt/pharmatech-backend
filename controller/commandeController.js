const panier = require("../db/models/panier");
const panierProduit = require("../db/models/panierproduit");
const produit = require("../db/models/produit");
const commande = require("../db/models/commande");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const commandeProduit = require("../db/models/commandeproduit");
const livraison = require("../db/models/livraison");

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
        attributes: ["nom", "prix", "tva_pourcentage"],
      },
    ],
  });

  if (panierProduits.length === 0) {
    return next(new AppError("Le panier est vide", 400));
  }

  // Créer une commande
  const nouvelleCommande = await commande.create({
    utilisateur_id: utilisateurId,
    panier_id: panierExistant.id,
    statut: "en cours",
    montant_total: panierProduits.reduce((acc, item) => {
      const prixTotal = item.quantite * item.produit.prix;
      const prixTVA = prixTotal * (item.produit.tva_pourcentage / 100);
      return acc + prixTotal + prixTVA;
    }, 0),
  });

  // Ajouter les produits à la commande
  await Promise.all(
    panierProduits.map(async (item) => {
      await commandeProduit.create({
        commande_id: nouvelleCommande.id,
        produit_id: item.produit_id,
        quantite: item.quantite,
        prix_unitaire: item.produit.prix,
        prixHTtotal: item.produit.prix * item.quantite,
        tva_pourcentage: item.produit.tva_pourcentage,
        prixTVA:
          item.produit.prix *
          item.quantite *
          (item.produit.tva_pourcentage / 100),
      });
    })
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
    include: [
      {
        model: commandeProduit,
        include: [
          {
            model: produit,
            attributes: ["nom", "prix", "tva_pourcentage"],
          },
        ],
      },
    ],
  });

  if (!commandes.length) {
    return next(new AppError("Aucune commande trouvée", 404));
  }

  // Transformer les données en fonction des besoins
  const resultats = commandes
    .map((commande) => {
      return commande.commandeProduits.map((cp) => {
        const prixUnitaire = cp.produit.prix;
        const quantiteCommandee = cp.quantite;
        const TVA = cp.produit.tva_pourcentage;
        const prixHT = prixUnitaire * quantiteCommandee;
        const prixAvecTVA = prixHT * (1 + TVA / 100);

        return {
          idCommande: commande.id,
          idProduit: cp.produit_id,
          nomProduit: cp.produit.nom,
          quantiteCommandee: quantiteCommandee,
          prixUnitaire: prixUnitaire,
          TVA: TVA,
          prixAvecTVA: prixAvecTVA,
        };
      });
    })
    .flat();

  return res.status(200).json({
    status: "success",
    data: resultats,
    message: "Voici les commandes de l'utilisateur",
  });
});

/*                          Récupérer les commandes d'un utilisateur                     */
const getCommandesUtilisateurId = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;
  const commandeId = req.params.id;

  const commandes = await commande.findAll({
    where: { utilisateur_id: utilisateurId, id: commandeId },
    include: [
      {
        model: commandeProduit,
        include: [
          {
            model: produit,
            attributes: ["nom", "prix", "tva_pourcentage"],
          },
        ],
      },
    ],
  });

  if (!commandes.length) {
    return next(new AppError("Aucune commande trouvée", 404));
  }

  // Transformer les données en fonction des besoins
  const resultats = commandes
    .map((commande) => {
      return commande.commandeProduits.map((cp) => {
        const prixUnitaire = cp.produit.prix;
        const quantiteCommandee = cp.quantite;
        const TVA = cp.produit.tva_pourcentage;
        const prixHT = prixUnitaire * quantiteCommandee;
        const prixAvecTVA = prixHT * (1 + TVA / 100);

        return {
          idCommande: commande.id,
          idProduit: cp.produit_id,
          nomProduit: cp.produit.nom,
          quantiteCommandee: quantiteCommandee,
          prixUnitaire: prixUnitaire,
          TVA: TVA,
          prixAvecTVA: prixAvecTVA,
        };
      });
    })
    .flat();

  return res.status(200).json({
    status: "success",
    data: resultats,
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

/*                          Supprimer une commande ainsi que ses commandeProduits                     */
const supprimerCommandesUtilisateurId = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;
  const commandeId = req.params.id;

  const commandes = await commande.findOne({
    where: { utilisateur_id: utilisateurId, id: commandeId },
    include: [
      {
        model: commandeProduit,
        include: [
          {
            model: produit,
            attributes: ["nom", "prix", "tva_pourcentage"],
          },
        ],
      },
    ],
  });

  if (!commandes) {
    return next(new AppError("Aucune commande trouvée", 404));
  }

  await commandeProduit.destroy({
    where: { commande_id: commandeId },
  });

  await livraison.destroy({
    where: { commande_id: commandeId },
  });

  await commande.destroy({
    where: { id: commandeId, utilisateur_id: utilisateurId },
  });

  return res.status(204).json({
    status: "success",
    message: "Commande et ses produits supprimés avec succès",
  });
});

module.exports = {
  creerCommande,
  getCommandesUtilisateur,
  getCommandesUtilisateurId,
  mettreAJourStatutCommande,
  supprimerCommandesUtilisateurId,
};
