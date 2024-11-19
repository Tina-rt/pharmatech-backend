const methodePaiement = require("../db/models/methodepaiement");
const catchAsync = require("../utils/catchAsync");

const creerMethodePaiement = catchAsync(async (req, res, next) => {
    const { nom, description } = req.body;

    const newMethodePaiement = await methodePaiement.create({
        nom,
        description,
    });

    return res.status(201).json({
        status: 'success',
        data: newMethodePaiement,
        message: 'Méthode de paiement créée avec succès',
    });
});

const obtenirMethodePaiementById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const methodePaiementTrouve = await methodePaiement.findByPk(id);

    if (!methodePaiementTrouve) {
        return next(new AppError('Méthode de paiement introuvable', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: methodePaiementTrouve,
    });
});

const obtenirToutesLesMethodesPaiement = catchAsync(async (req, res, next) => {
    const methodesPaiement = await methodePaiement.findAll({
        order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
        status: 'success',
        data: methodesPaiement,
    });
});

const mettreAJourMethodePaiement = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { nom, description } = req.body;

    const methodePaiementTrouve = await methodePaiement.findByPk(id);

    if (!methodePaiementTrouve) {
        return next(new AppError('Méthode de paiement introuvable', 404));
    }

    await methodePaiementTrouve.update({
        nom,
        description,
    });

    return res.status(200).json({
        status: 'success',
        data: methodePaiementTrouve,
        message: 'Méthode de paiement mise à jour avec succès',
    });
});

const supprimerMethodePaiement = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const methodePaiementTrouve = await methodePaiement.findByPk(id);

    if (!methodePaiementTrouve) {
        return next(new AppError('Méthode de paiement introuvable', 404));
    }

    await methodePaiementTrouve.destroy();

    return res.status(204).json({
        status: 'success',
        message: 'Méthode de paiement supprimée avec succès',
    });
});

module.exports = {
    creerMethodePaiement,
    obtenirMethodePaiementById,
    obtenirToutesLesMethodesPaiement,
    mettreAJourMethodePaiement,
    supprimerMethodePaiement,
};
