const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const facture = require("../db/models/facture");
const commande = require("../db/models/commande");
const commandeProduit = require("../db/models/commandeproduit");
const nodemailer = require("nodemailer");
const produit = require("../db/models/produit");
const livraison = require("../db/models/livraison");
const utilisateur = require("../db/models/utilisateur");
const methodeLivraison = require("../db/models/methodelivraison");

//creer le facture et l'envoyer a l'email
const creerFacture = catchAsync(async (req, res, next) => {
  const commande_id = req.body.commande_id;

  // Vérifier si la commande existe et inclure les produits et livraison
  const commandeExistante = await commande.findByPk(commande_id, {
    include: [
      {
        model: commandeProduit,
        include: [
          { model: produit, attributes: ["nom", "prix", "tva_pourcentage"] },
        ],
      },
      {
        model: livraison,
        include: [
          {
            model: methodeLivraison,
            as: "methodeLivraison",
            attributes: ["prix"],
          },
        ],
      },
      {
        model: utilisateur, // Inclure les informations de l'utilisateur
        attributes: ["nom", "prenom", "email"],
      },
    ],
  });

  if (!commandeExistante) {
    return next(new AppError("Commande introuvable", 404));
  }

  // Calcul du montant total des produits et de la TVA
  let montantProduits = 0.0;
  let totalTVA = 0.0;

  commandeExistante.commandeProduits.forEach((cp) => {
    const prixHT = parseFloat(cp.produit.prix * cp.quantite);
    const tva = parseFloat(prixHT * (cp.produit.tva_pourcentage / 100));
    montantProduits += prixHT;
    totalTVA += tva;
  });

  // Ajouter les frais de livraison
  const prixLivraison = parseFloat(
    commandeExistante.livraison.methodeLivraison.prix
  );

  // Calcul du montant total final
  const montantTotal = montantProduits + totalTVA + prixLivraison;

  // Générer un numéro de facture unique
  const numeroFacture = `FACT-${Date.now()}`;

  // Créer la facture
  const nouvelleFacture = await facture.create({
    commande_id,
    numero_facture: numeroFacture,
    date_emission: new Date(),
    montant_total: montantTotal,
    statut_paiement: "en attente",
  });

  // Préparer les détails de la facture pour l'email
  const detailsFacture = `
    Bonjour ${commandeExistante.utilisateur.prenom} ${
    commandeExistante.utilisateur.nom
  },

    Voici les détails de votre facture :

    Numéro de facture : ${nouvelleFacture.numero_facture}
    Date d'émission : ${nouvelleFacture.date_emission}
    Montant total : ${montantTotal} Ar

    Détails de la commande :
    ${commandeExistante.commandeProduits
      .map(
        (cp) =>
          `${cp.quantite} x ${cp.produit.nom} - Prix unitaire : ${cp.produit.prix} Ar`
      )
      .join("\n")}

    Frais de livraison : ${prixLivraison} Ar
    TVA totale : ${totalTVA} Ar

    Total à payer : ${montantTotal} Ar

    Merci de votre achat !
  `;

  // Configurer Nodemailer pour envoyer l'email
  const transporter = nodemailer.createTransport({
    service: "gmail", // Utilisez un service email configuré (ou autre)
    auth: {
      user: process.env.EMAIL_USER, // Votre email
      pass: process.env.EMAIL_PASS, // Votre mot de passe
    },
  });

  // Format HTML de l'email
  const htmlEmail = `
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
          <h1>Votre Facture chez PHARMATECH</h1>
          <p>Bonjour ${commandeExistante.utilisateur.prenom},</p>
          <p>Merci pour votre commande. Voici les détails de votre facture :</p>
          <p><strong>Numéro de facture :</strong> ${
            nouvelleFacture.numero_facture
          }</p>
          <p><strong>Date d'émission :</strong> ${
            nouvelleFacture.date_emission
          }</p>
          <p><strong>Montant total :</strong> ${montantTotal} Ar</p>
          <p>Détails de la commande :</p>
          <ul>
            ${commandeExistante.commandeProduits
              .map(
                (cp) =>
                  `<li>${cp.quantite} x ${cp.produit.nom} - Prix unitaire : ${cp.produit.prix} Ar</li>`
              )
              .join("")}
          </ul>
          <p><strong>Frais de livraison :</strong> ${prixLivraison} Ar</p>
          <p><strong>TVA totale :</strong> ${totalTVA} Ar</p>
          <p><strong>Total à payer :</strong> ${montantTotal} Ar</p>
        </div>
      </body>
    </html>
  `;

  // Envoyer l'email
  await transporter.sendMail({
    from: {
      name: "PHARMATECH",
      address: process.env.EMAIL_USER,
    },
    to: commandeExistante.utilisateur.email, // Email du destinataire
    subject: `Votre Facture N° ${nouvelleFacture.numero_facture} - PHARMATECH`,
    text: detailsFacture, // Corps du texte brut
    html: htmlEmail, // Corps HTML
  });

  return res.status(201).json({
    status: "success",
    data: nouvelleFacture,
    message: "Facture créée et email envoyé avec succès",
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
        include: [{ model: commandeProduit, include: [{ model: produit }] }],
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
