const paiement = require("../db/models/paiement");
const commande = require("../db/models/commande");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Créer un paiement
const creerPaiement = catchAsync(async (req, res, next) => {
  const { commande_id, montant, mode_paiement, reference } = req.body;

  // Vérifier si la commande existe
  const commandeExistante = await commande.findByPk(commande_id);
  if (!commandeExistante) {
    return next(new AppError("Commande introuvable", 404));
  }

  // Créer le paiement
  const nouveauPaiement = await paiement.create({
    commande_id,
    montant,
    mode_paiement,
    reference,
    statut_paiement: "en attente", // Par défaut, le statut est "en attente"
  });

  return res.status(201).json({
    status: "success",
    data: nouveauPaiement,
    message: "Paiement créé avec succès",
  });
});

// Récupérer un paiement par ID
const obtenirPaiement = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Rechercher le paiement
  const paiementTrouve = await paiement.findByPk(id);

  if (!paiementTrouve) {
    return next(new AppError("Paiement introuvable", 404));
  }

  return res.status(200).json({
    status: "success",
    data: paiementTrouve,
  });
});

// Mettre à jour le statut d'un paiement
const mettreAJourStatutPaiement = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { statut_paiement } = req.body;

  // Vérifier si le paiement existe
  const paiementTrouve = await paiement.findByPk(id);

  if (!paiementTrouve) {
    return next(new AppError("Paiement introuvable", 404));
  }

  // Mettre à jour le statut
  paiementTrouve.statut_paiement = statut_paiement;
  await paiementTrouve.save();

  return res.status(200).json({
    status: "success",
    data: paiementTrouve,
    message: "Statut du paiement mis à jour avec succès",
  });
});

// Supprimer un paiement (soft delete)
const supprimerPaiement = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Vérifier si le paiement existe
  const paiementTrouve = await paiement.findByPk(id);

  if (!paiementTrouve) {
    return next(new AppError("Paiement introuvable", 404));
  }

  // Soft delete
  await paiementTrouve.destroy();

  return res.status(204).json({
    status: "success",
    data: null,
    message: "Paiement supprimé avec succès",
  });
});

module.exports = {
  creerPaiement,
  mettreAJourStatutPaiement,
  obtenirPaiement,
  supprimerPaiement,
};
