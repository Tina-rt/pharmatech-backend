const utilisateur = require("../db/models/utilisateur");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const converter = require('csvjson');

// Créer Utilisateur
const creerUtilisateur = catchAsync(async (req, res, next) => {
    const body = req.body;
    const utilisateurExistant = await utilisateur.findOne({
        where: { email: body.email },
    });
    if (utilisateurExistant) {
        return next(
            new AppError("Un utilisateur avec cet email existe déjà", 400)
        );
    }

    const nouvelUtilisateur = await utilisateur.create({
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        motdepasse: await bcrypt.hashSync(body.mot_de_passe, 10),
        phone: body.phone,
        role: body.role,
    });

    console.log(nouvelUtilisateur);

    if (!nouvelUtilisateur) {
        return next(new AppError("Impossible de créer l'utilisateur", 400));
    }
    return res.status(201).json({
        status: "Success",
        data: nouvelUtilisateur,
        message: "Utilisateur créé avec succès",
    });
});

const emailValid = catchAsync(async (req, res, next) => {
    const body = req.body;
    const utilisateurExistant = await utilisateur.findOne({
        where: { email: body.email },
    });
    if (utilisateurExistant) {
        return next(
            new AppError("Un utilisateur avec cet email existe déjà", 400)
        );
    }

    return res.status(200).json({
        status: "Success",
        data: true,
        message: "Utilisateur approuvé",
    });
});

// Lire tous les utilisateurs
const getUtilisateursClient = catchAsync(async (req, res, next) => {
    const resultat = await utilisateur.findAll({
        attributes: { exclude: ["motdepasse"] },
        where: {
            role: "client",
        },
    });

    return res.json({
        status: "success",
        data: resultat,
        message: "Voici la liste de tous les clients",
    });
});

const getUtilisateursAdmin = catchAsync(async (req, res, next) => {
    const resultat = await utilisateur.findAll({
        attributes: { exclude: ["motdepasse"] },
        where: {
            role: "admin",
        },
    });

    return res.json({
        status: "success",
        data: resultat,
        message: "Voici la liste de tous les utilisateurs Admin",
    });
});

const modifyAdmin = catchAsync(async (req, res, next) => {
    const body = req.body;

    const resultat = await utilisateur.findOne({
        where: { id: body.id },
    });

    if (!resultat) {
        return next(new AppError("C'est pas le bon utilisateur", 400));
    }

    resultat.nom = body.nom;
    resultat.prenom = body.prenom;
    resultat.email = body.email;
    if (body.mot_de_passe) {
        resultat.motdepasse = await bcrypt.hashSync(body.mot_de_passe, 10);
    }
    if (body.role) {
        resultat.role = body.role;
    }
    const resultatModifier = await resultat.save();

    return res.json({
        status: "success",
        data: resultatModifier,
        message: "Utilisateur modifié avec succès",
    });
})

// Lire un utilisateur par ID
const getUtilisateurId = catchAsync(async (req, res, next) => {
    const utilisateurId = req.params.id;

    const resultat = await utilisateur.findByPk(utilisateurId);

    if (!resultat) {
        return next(new AppError("ID utilisateur introuvable", 400));
    }
    return res.json({
        status: "success",
        data: resultat,
        message: "Voici l'utilisateur",
    });
});

// Modifier utilisateur
const modifierUtilisateur = catchAsync(async (req, res, next) => {
    const utilisateurId = req.params.id;
    const body = req.body;

    const resultat = await utilisateur.findOne({
        where: { id: body.id },
    });

    if (!resultat) {
        return next(new AppError("C'est pas le bon utilisateur", 400));
    }

    resultat.nom = body.nom;
    resultat.prenom = body.prenom;
    resultat.email = body.email;
    if (body.mot_de_passe) {
        resultat.mot_de_passe = body.mot_de_passe;
    }
    if (body.role) {
        resultat.role = body.role;
    }
    const resultatModifier = await resultat.save();

    return res.json({
        status: "success",
        data: resultatModifier,
        message: "Utilisateur modifié avec succès",
    });
});

// Supprimer un utilisateur
const supprimerUtilisateur = catchAsync(async (req, res, next) => {
    const utilisateurID = req.params.id;

    const resultat = await utilisateur.findOne({
        where: { id: utilisateurID },
    });

    if (!resultat) {
        return next(new AppError("ID utilisateur invalide", 400));
    }

    await resultat.destroy();

    return res.json({
        status: "success",
        data: true,
        message: "Utilisateur supprimé avec succès",
    });
});

// Exporter tous les Clients


const exportClients = catchAsync(async (req, res, next) => {
    const resultat = await utilisateur.findAll({
        attributes: { exclude: ["motdepasse"] },
        where: {
            role: "client",
        },
    });

    const simpleResult = resultat.map(user => ({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        phone: user.phone
    }));
    // console.log(simpleResult);
    const csvData = converter.toCSV(simpleResult, {delimiter: ',', wrap: false, headers: 'key'})

    res.setHeader(
        'Content-disposition',
      'attachment; filename=clients.csv'
    );

    res.setHeader('Content-type', 'application/vnd.ms-excel');
    return res.send(csvData);

    // return res.json({
    //     status: "success",
    //     data: resultat,
    //     message: "Voici la liste de tous les clients",
    // });
} )


module.exports = {
    creerUtilisateur,
    getUtilisateursClient,
    getUtilisateursAdmin,
    getUtilisateurId,
    modifierUtilisateur,
    supprimerUtilisateur,
    emailValid,
    modifyAdmin,
    exportClients
};
