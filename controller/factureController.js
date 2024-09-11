const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const facture = require("../db/models/facture");
const commande = require("../db/models/commande");

// Créer une nouvelle facture
const creerFacture = catchAsync(async (req, res, next) => {
  const { commande_id } = req.body;

  // Vérifier si la commande existe
  const commandeExistante = await commande.findByPk(commande_id);
  if (!commandeExistante) {
    return next(new AppError("Commande introuvable", 404));
  }

  // Générer un numéro de facture unique
  const numeroFacture = `FACT-${Date.now()}`;

  // Calculer le montant total de la facture
  const montant_total = commandeExistante.montant_total;

  // Créer la facture
  const nouvelleFacture = await facture.create({
    commande_id,
    numero_facture: numeroFacture,
    date_emission: new Date(),
    montant_total,
    statut_paiement: "en attente",
  });

  return res.status(201).json({
    status: "success",
    data: nouvelleFacture,
    message: "Facture créée avec succès",
  });
});

// Récupérer toutes les factures pour un utilisateur
const getFacturesUtilisateur = catchAsync(async (req, res, next) => {
  const utilisateurId = req.utilisateur.id;

  const factures = await facture.findAll({
    include: [
      {
        model: commande,
        where: { utilisateur_id: utilisateurId },
      },
    ],
  });

  if (!factures.length) {
    return next(new AppError("Aucune facture trouvée", 404));
  }

  return res.status(200).json({
    status: "success",
    data: factures,
  });
});

// Récupérer une facture par ID
const getFactureById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const factureExistante = await facture.findByPk(id, {
    include: [{ model: commande }],
  });

  if (!factureExistante) {
    return next(new AppError("Facture introuvable", 404));
  }

  return res.status(200).json({
    status: "success",
    data: factureExistante,
  });
});

// Mettre à jour le statut d'une facture
const mettreAJourStatutFacture = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { statut_paiement } = req.body;

  if (
    !["en attente", "paye", "partiellement paye", "rembourse"].includes(
      statut_paiement
    )
  ) {
    return next(new AppError("Statut de paiement invalide", 400));
  }

  const factureExistante = await facture.findByPk(id);
  if (!factureExistante) {
    return next(new AppError("Facture introuvable", 404));
  }

  factureExistante.statut_paiement = statut_paiement;
  await factureExistante.save();

  return res.status(200).json({
    status: "success",
    message: "Statut de la facture mis à jour avec succès",
  });
});

module.exports = {
  creerFacture,
  getFacturesUtilisateur,
  getFactureById,
  mettreAJourStatutFacture,
};
