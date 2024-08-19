require("dotenv").config({ path: process.cwd() + "/.env" });

const utilisateur = require("../db/models/utilisateur");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Configuration du transporteur de courrier électronique
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//generer un Token
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

/*                         RESTRICTION CERTAIN ROLE                  */
const restriction = (...role) => {
  const checkPermission = (req, res, next) => {
    // Vérification si req.utilisateur est défini
    if (!req.utilisateur) {
      return next(new AppError("Utilisateur non authentifié", 401));
    }

    // Vérification du rôle
    if (!role.includes(req.utilisateur.role)) {
      return next(
        new AppError("Vous n'avez pas la permission pour cette action", 403)
      );
    }
    return next();
  };
  return checkPermission;
};

/*                         DECONNEXION                         */
const deconnexion = (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Déconnexion réussie",
  });
};

/*                         MIDDLEWARE D'AUTHENTIFICATION                  */
const authentification = catchAsync(async (req, res, next) => {
  // 1. Récupérer le token depuis les en-têtes
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Bearer asfdasdfhjasdflkkasdf
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return next(new AppError("Veuillez vous connecter pour accéder", 401));
  }

  // 2. Vérification du token
  const tokenDetail = jwt.verify(idToken, process.env.SECRET_KEY_JWT);

  // 3. Récupérer les détails de l'utilisateur depuis la base de données et les ajouter à l'objet req
  const utilisateurRecent = await utilisateur.findByPk(tokenDetail.id);

  if (!utilisateurRecent) {
    return next(new AppError("L’utilisateur n’existe plus", 400));
  }

  req.user = utilisateurRecent;
  return next();
});

module.exports = {
  inscription,
  connexion,
  deconnexion,
  authentification,
  restriction,
};
