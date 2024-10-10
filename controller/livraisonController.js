const livraison = require("../db/models/livraison");
const multer = require("multer");
const commande = require("../db/models/commande");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const methodeLivraison = require("../db/models/methodelivraison");
const { where } = require("sequelize");
const utilisateur = require("../db/models/utilisateur");
const commandeProduit = require("../db/models/commandeproduit");
const produit = require("../db/models/produit");

// Configuration de Multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/prescription");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Créer une nouvelle livraison
const creerLivraison = catchAsync(async (req, res, next) => {
  const body = req.body;

  // Vérifier si la livraison existe
  const LivraisonExistante = await livraison.findOne({
    where: {
      commande_id: body.commande_id,
    },
  });
  if (LivraisonExistante) {
    return next(new AppError("Livrason deja effectuee", 404));
  }

  // Vérifier si la commande existe
  const commandeExistante = await commande.findOne({
    where: { id: body.commande_id, utilisateur_id: req.utilisateur.id },
  });

  if (!commandeExistante) {
    return next(new AppError("Commande introuvable", 404));
  }

  // Créer une nouvelle livraison
  const nouvelleLivraisonData = {
    commande_id: body.commande_id,
    nom: body.nom,
    prenom: body.prenom,
    email: body.email,
    phone: body.phone,
    adresse: body.adresse,
    ville: body.ville,
    code_postal: body.code_postal,
    date_livraison: body.date_livraison,
    transporteur: body.transporteur,
    numero_suivi: body.numero_suivi,
    // methode_livraison_id: body.methode_livraison_id,
    statut_livraison: "En attente",
  }
  if (req.file){
    nouvelleLivraisonData['prescription'] = req.file.path;
  }
  const nouvelleLivraison = await livraison.create(nouvelleLivraisonData);

  return res.status(201).json({
    status: "success",
    data: nouvelleLivraison,
    message: "Livraison créée avec succès",
  });
});

// Récupérer toutes les livraisons pour toutes les commandes
const getToutesLivraisons = catchAsync(async (req, res, next) => {
  const livraisons = await livraison.findAll({
    include: [
      {
        model: commande,
        attributes: ["id", "utilisateur_id", "date_commande", "statut"],
        where: { utilisateur_id: req.utilisateur.id },
      },
      {
        model: methodeLivraison,
        attributes: ["nom", "description", "prix"],
        as: "methodeLivraison",
      },
    ],
  });

  if (!livraisons.length) {
    return next(new AppError("Aucune livraison trouvée", 404));
  }

  return res.status(200).json({
    status: "success",
    data: livraisons,
    message: "Voici toutes les livraisons pour toutes les commandes",
  });
});

const getToutesLesLivraisonsProduitsParUtilisateur = catchAsync(
  async (req, res, next) => {
    // Requête pour récupérer toutes les livraisons associées aux commandes avec les utilisateurs et les produits
    const livraisons = await livraison.findAll({
      include: [
        {
          model: commande, // Inclure les commandes associées à chaque livraison
          attributes: ["id", "utilisateur_id"], // On prend les attributs nécessaires des commandes
          include: [
            {
              model: commandeProduit, // Inclure les produits de chaque commande
              include: [
                {
                  model: produit, // Inclure les informations sur les produits
                  attributes: ["id", "nom", "prix", "tva_pourcentage"],
                },
              ],
            },
            {
              model: utilisateur, // Inclure les informations de chaque utilisateur
              attributes: ["id", "nom", "prenom", "email"],
            },
          ],
        },
      ],
    });

    // Vérifier si des livraisons existent
    if (!livraisons.length) {
      return next(new AppError("Aucune livraison trouvée", 404));
    }

    // Structurer les résultats par utilisateur
    const livraisonsParUtilisateur = livraisons.reduce((acc, livraison) => {
      const utilisateurId = livraison.commande.utilisateur.id;
      const utilisateurInfo = {
        id: livraison.commande.utilisateur.id,
        nom: livraison.commande.utilisateur.nom,
        prenom: livraison.commande.utilisateur.prenom,
        email: livraison.commande.utilisateur.email,
      };

      // Si l'utilisateur n'existe pas encore dans l'accumulateur, on l'ajoute
      if (!acc[utilisateurId]) {
        acc[utilisateurId] = {
          utilisateur: utilisateurInfo,
          commandes: [],
        };
      }

      // Ajouter la commande et les produits associés
      const produitsDansCommande = livraison.commande.commandeProduits.map(
        (cp) => {
          const prixUnitaire = cp.produit.prix;
          const TVA = cp.produit.tva_pourcentage;
          const quantiteCommandee = cp.quantite;
          const prixAvecTVA =
            prixUnitaire * quantiteCommandee * (1 + TVA / 100);

          return {
            idProduit: cp.produit.id,
            nomProduit: cp.produit.nom,
            quantiteCommandee: quantiteCommandee,
            prixUnitaire: prixUnitaire,
            TVA: TVA,
            prixAvecTVA: prixAvecTVA,
          };
        }
      );

      acc[utilisateurId].commandes.push({
        idCommande: livraison.commande.id,
        livraisonId: livraison.id,
        produits: produitsDansCommande,
      });

      return acc;
    }, {});

    return res.status(200).json({
      status: "success",
      data: livraisonsParUtilisateur,
      message:
        "Voici toutes les livraisons et produits associés, classées par utilisateur",
    });
  }
);

// Récupérer les livraisons associées à une commande
const getLivraisonsParCommande = catchAsync(async (req, res, next) => {
  const commande_id = req.params.id;

  // Vérifier si la commande existe
  const commandeExistante = await commande.findOne({
    where: { id: commande_id, utilisateur_id: req.utilisateur.id },
  });

  if (!commandeExistante) {
    return next(new AppError("Commande introuvable", 404));
  }
  const livraisons = await livraison.findAll({
    where: { commande_id },
  });

  if (!livraisons.length) {
    return next(
      new AppError("Aucune livraison trouvée pour cette commande", 404)
    );
  }

  return res.status(200).json({
    status: "success",
    data: livraisons,
    message: "Voici les livraisons associées à la commande",
  });
});

// Mettre à jour le statut d'une livraison
const mettreAJourStatutLivraison = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const statut_livraison = req.body.statut_livraison;

  if (
    !["En attente", "En transit", "Livree", "Retour"].includes(statut_livraison)
  ) {
    return next(new AppError("Statut de livraison invalide", 400));
  }

  const livraisonExistante = await livraison.findByPk(id);

  if (!livraisonExistante) {
    return next(new AppError("Livraison introuvable", 404));
  }

  livraisonExistante.statut_livraison = statut_livraison;
  await livraisonExistante.save();

  return res.status(200).json({
    status: "success",
    message: "Statut de la livraison mis à jour avec succès",
  });
});

module.exports = {
  creerLivraison,
  getLivraisonsParCommande,
  getToutesLesLivraisonsProduitsParUtilisateur,
  getToutesLivraisons,
  mettreAJourStatutLivraison,
  upload,
};
