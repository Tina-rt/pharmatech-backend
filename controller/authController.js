require("dotenv").config({ path: process.cwd() + "/.env" });

const utilisateur = require("../db/models/utilisateur");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY_JWT, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

/*                         INSCRIPTION                  */
const inscription = catchAsync(async (req, res, next) => {
  const body = req.body;

  // Vérification si un utilisateur avec le même email existe déjà
  const utilisateurExistant = await utilisateur.findOne({
    where: { email: body.email },
  });
  if (utilisateurExistant) {
    return next(new AppError("Un utilisateur avec cet email existe déjà", 400));
  }

  //inscription de l'utilisateur
  const nouveau_utilisateur = await utilisateur.create({
    nom: body.nom,
    prenom: body.prenom,
    email: body.email,
    motdepasse: await bcrypt.hashSync(body.motdepasse, 10),
    adresse: body.adresse,
    phone: body.phone,
    role: body.role,
  });

  //si l'inscription a echouer
  if (!nouveau_utilisateur) {
    return next(new AppError("Impossible de creer l'utilisateur", 400));
  }

  const resultat = nouveau_utilisateur.toJSON();

  // Gestion de generation de token
  delete resultat.motdepasse;
  delete resultat.deletedAt;

  resultat.token = generateToken({
    id: resultat.id,
  });

  return res.status(201).json({
    status: "Success",
    data: resultat,
    message: "Creation d'une utilisateur avec succes",
  });
});

/*                        CONNEXION                         */
//connexion controller
const connexion = catchAsync(async (req, res, next) => {
  const { email, phone, motdepasse } = req.body;

  //si il n'y a pas de mot de passe ou email
  if (!(email || phone) || !motdepasse) {
    return next(new AppError("Veuillez vous renseigner s'il vous plait", 400));
  }

  //voir si c'est le bonne utilisateur
  let resultat;
  if (email) {
    resultat = await utilisateur.findOne({
      where: { email },
    });
  } else {
    resultat = await utilisateur.findOne({
      where: { phone },
    });
  }

  if (!resultat || !(await bcrypt.compare(motdepasse, resultat.motdepasse))) {
    return next(new AppError("Votre email ou mot de passe errone", 401));
  }

  const token = generateToken({
    id: resultat.id,
  });

  return res.status(201).json({
    status: "Success",
    token,
  });
});

/*                         MISE A JOUR DU PROFIL                  */

const miseAJourProfil = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const { nom, prenom, email, adresse, phone } = req.body;

  const utilisateurToUpdate = await utilisateur.findByPk(userId);

  if (!utilisateurToUpdate) {
    return next(new AppError("Utilisateur non trouvé", 404));
  }

  utilisateurToUpdate.nom = nom;
  utilisateurToUpdate.prenom = prenom;
  utilisateurToUpdate.email = email;
  utilisateurToUpdate.adresse = adresse;
  utilisateurToUpdate.phone = phone;

  await utilisateurToUpdate.save();

  return res.status(200).json({
    status: "Success",

    message: "Profil mis à jour avec succès",
  });
});

/*                         SUPPRESSION DU COMPTE                  */

const suppressionCompte = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const utilisateurToDelete = await utilisateur.findByPk(userId);

  if (!utilisateurToDelete) {
    return next(new AppError("Utilisateur non trouvé", 404));
  }

  await utilisateurToDelete.destroy();

  return res.status(200).json({
    status: "Success",
    message: "Compte supprimé avec succès",
  });
});
module.exports = { inscription, connexion, miseAJourProfil, suppressionCompte };
