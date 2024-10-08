const utilisateur = require("../db/models/utilisateur");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Créer Utilisateur
const creerUtilisateur = catchAsync(async (req, res, next) => {
  const body = req.body;

  const utilisateurExistant = await utilisateur.findOne({
    where: { email: body.email },
  });
  if (utilisateurExistant) {
    return next(new AppError("Un utilisateur avec cet email existe déjà", 400));
  }

  const nouvelUtilisateur = await utilisateur.create({
    nom: body.nom,
    prenom: body.prenom,
    email: body.email,
    mot_de_passe: body.mot_de_passe,
    phone: body.phone,
    role: body.role,
  });

  if (!nouvelUtilisateur) {
    return next(new AppError("Impossible de créer l'utilisateur", 400));
  }
  return res.status(201).json({
    status: "Success",
    data: nouvelUtilisateur,
    message: "Utilisateur créé avec succès",
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
      role: "Admin",
    },
  });

  return res.json({
    status: "success",
    data: resultat,
    message: "Voici la liste de tous les utilisateurs Admin",
  });
});

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
    where: { id: utilisateurId },
  });

  if (!resultat) {
    return next(new AppError("C'est pas le bon utilisateur", 400));
  }

  resultat.nom = body.nom;
  resultat.prenom = body.prenom;
  resultat.email = body.email;
  resultat.mot_de_passe = body.mot_de_passe;
  resultat.role = body.role;

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
    message: "Utilisateur supprimé avec succès",
  });
});

module.exports = {
  creerUtilisateur,
  getUtilisateursClient,
  getUtilisateursAdmin,
  getUtilisateurId,
  modifierUtilisateur,
  supprimerUtilisateur,
};
