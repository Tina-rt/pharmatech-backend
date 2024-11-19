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
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
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

  // Envoi d'un email de confirmation
  await transporter.sendMail({
    from: {
      name: "PHARMATECH",
      address: process.env.EMAIL_USER,
    },
    to: body.email, // liste des destinataires
    subject: "Inscription sur PHARMATECH", // ligne de sujet
    text: "Bienvenue chez PHARMATECH", // corps du texte brut
    html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        h1 {
            color: #2ecc71; /* Vert clair */
            font-size: 2em;
            margin-bottom: 20px;
            font-weight: 700;
        }
        p {
            font-size: 1em;
            line-height: 1.5;
            margin-bottom: 10px;
        }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Soyez la bienvenue chez PHARMATECH</h1>
          <p>Nous sommes ravis de vous accueillir dans notre communauté.</p>
          <p>Merci de vous être inscrit. Nous avons hâte de vous servir.</p>
        </div>
      </body>
    </html>
  `, // corps HTML
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
const connexionAdmin = catchAsync(async (req, res, next) => {
  const { email, phone, motdepasse } = req.body;

  //si il n'y a pas de mot de passe ou email
  if (!(email || phone) || !motdepasse) {
    return next(new AppError("Veuillez vous renseigner s'il vous plait", 400));
  }

  //voir si c'est le bonne utilisateur
  let resultat;
  if (email) {
    resultat = await utilisateur.findOne({
      where: { email, role: "admin" },
    });
  } else {
    resultat = await utilisateur.findOne({
      where: { phone, role: "admin" },
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
const restriction = (...roles) => {
  const checkPermission = (req, res, next) => {
    // Vérification si req.utilisateur est défini
    if (!req.utilisateur) {
      return next(new AppError("Utilisateur non authentifié", 401));
    }

    // Vérification du rôle
    if (!roles.includes(req.utilisateur.role)) {
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

  req.utilisateur = utilisateurRecent;
  return next();
});

/*                         RECUPERATION COMPTE                         */
const motdepasseoublie = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const utilisateurExistant = await utilisateur.findOne({
    where: { email },
  });

  if (!utilisateurExistant) {
    return next(new AppError("Aucun utilisateur trouvé avec cet email", 404));
  }

  const resetToken = generateToken({ id: utilisateurExistant.id });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/utilisateurs/resetPassword/${resetToken}`;

  const message = `. Veuillez cliquer sur ce lien : ${resetUrl}`;

  // Envoi d'un email de confirmation
  await transporter.sendMail({
    from: {
      name: "PHARMATECH",
      address: process.env.EMAIL_USER,
    },
    to: utilisateurExistant.email, // liste des destinataires
    subject: "Réinitialisation de votre mot de passe", // ligne de sujet
    text: message, // corps du texte brut
    html: `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 600px;
          width: 100%;
        }
        h1 {
          color: #2ecc71; /* Vert clair */
          font-size: 1.5em;
          margin-bottom: 20px;
          font-weight: 700;
        }
        p {
          font-size: 1em;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        a {
          color: #007BFF; /* Bleu pour le lien */
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Réinitialisation de mot de passe</h1>
        <p>Bonjour,</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte PHARMATECH.</p>
        <p>Veuillez cliquer sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <p><a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <p>Merci,</p>
        <p>L'équipe PHARMATECH</p>
      </div>
    </body>
  </html>
  `, // corps HTML
  });

  return res.status(200).json({
    status: "Success",
    message: "Email de réinitialisation envoyé",
  });
});

module.exports = {
  inscription,
  connexion,
  connexionAdmin,
  deconnexion,
  authentification,
  restriction,
  motdepasseoublie,
};
