const panier = require("../db/models/panier");
const panierProduit = require("../db/models/panierproduit");
const produit = require("../db/models/produit");
const commande = require("../db/models/commande");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const commandeProduit = require("../db/models/commandeproduit");
const livraison = require("../db/models/livraison");
const utilisateur = require("../db/models/utilisateur");
const paiement = require("../db/models/paiement");
const methodePaiement = require("../db/models/methodepaiement");
const converter = require("csvjson");

// Créer une nouvelle commande
const creerCommande = catchAsync(async (req, res, next) => {
    const utilisateurId = req.utilisateur.id;

    // Trouver le panier actif de l'utilisateur
    const panierExistant = await panier.findOne({
        where: { utilisateur_id: utilisateurId, statut: "actif" },
    });

    if (!panierExistant) {
        return next(new AppError("Vous n'avez pas de panier actif", 400));
    }

    // Récupérer les produits du panier
    const panierProduits = await panierProduit.findAll({
        where: { panier_id: panierExistant.id },
        include: [
            {
                model: produit,
                attributes: ["nom", "prix", "tva_pourcentage"],
            },
        ],
    });

    if (panierProduits.length === 0) {
        return next(new AppError("Le panier est vide", 400));
    }

    // Créer une commande
    const nouvelleCommande = await commande.create({
        utilisateur_id: utilisateurId,
        panier_id: panierExistant.id,
        statut: "en cours",
        montant_total: panierProduits.reduce((acc, item) => {
            const prixTotal = item.quantite * item.produit.prix;
            const prixTVA = prixTotal * (item.produit.tva_pourcentage / 100);
            return acc + prixTotal + prixTVA;
        }, 0),
    });

    // Ajouter les produits à la commande
    await Promise.all(
        panierProduits.map(async (item) => {
            await commandeProduit.create({
                commande_id: nouvelleCommande.id,
                produit_id: item.produit_id,
                quantite: item.quantite,
                prix_unitaire: item.produit.prix,
                prixHTtotal: item.produit.prix * item.quantite,
                tva_pourcentage: item.produit.tva_pourcentage,
                prixTVA:
                    item.produit.prix *
                    item.quantite *
                    (item.produit.tva_pourcentage / 100),
            });
        })
    );

    // Mettre à jour le statut du panier
    panierExistant.statut = "commande";
    await panierExistant.save();

    return res.status(201).json({
        status: "success",
        data: nouvelleCommande,
        message: "Commande créée avec succès",
    });
});

/*                          Récupérer les commandes des utilisateurs                     */
const getCommandesUtilisateurs = catchAsync(async (req, res, next) => {
    const commandes = await commande.findAll({
        include: [
            {
                model: commandeProduit,
                include: [
                    {
                        model: produit,
                        attributes: ["nom", "prix", "tva_pourcentage", "image"],
                    },
                ],
            },

            {
                model: utilisateur, // On inclut l'utilisateur associé à la commande
                attributes: ["id", "nom", "prenom", "email"], // Sélection des attributs utilisateur
            },
        ],
    });

    if (!commandes.length) {
        return next(new AppError("Aucune commande trouvée", 404));
    }

    // Transformer les données en fonction des besoins
    const resultats = commandes.map((commande) => {
        // const currPaiement = await paiement.findAll({
        //     where: {
        //         commande_id : commande.id
        //     },

        // })
        return {
            idUtilisateur: commande.utilisateur.id, // ID de l'utilisateur
            nomUtilisateur: commande.utilisateur.nom, // Nom de l'utilisateur
            prenomUtilisateur: commande.utilisateur.prenom, // Prénom de l'utilisateur
            emailUtilisateur: commande.utilisateur.email, // Email de l'utilisateur
            idCommande: commande.id, // ID de la commande
            dateCommande: commande.date_commande, // Date de la commande
            statut: commande.statut,
            total: commande.commandeProduits.reduce((acc, item) => {
                const prixTotal = item.quantite * item.produit.prix;
                const prixTVA =
                    prixTotal * (item.produit.tva_pourcentage / 100);
                return acc + prixTotal + prixTVA;
            }, 0),
            produits: commande.commandeProduits.map((cp) => {
                const prixUnitaire = cp.produit.prix;
                const quantiteCommandee = cp.quantite;
                const TVA = cp.produit.tva_pourcentage;
                const prixHT = prixUnitaire * quantiteCommandee;
                const prixAvecTVA = prixHT * (1 + TVA / 100);

                return {
                    idProduit: cp.produit_id,
                    nomProduit: cp.produit.nom,
                    quantiteCommandee: quantiteCommandee,
                    prixUnitaire: prixUnitaire,
                    tva: +TVA,
                    prixAvecTVA: prixAvecTVA,
                    image: cp.produit.image,
                };
            }),
        };
    });

    return res.status(200).json({
        status: "success",
        data: resultats, // Retourner une liste d'objets
        message:
            "Voici la liste des commandes avec les détails des utilisateurs.",
    });
});

/*                          Récupérer les commandes d'un utilisateur                     */
const getCommandesUtilisateur = catchAsync(async (req, res, next) => {
    const utilisateurId = req.utilisateur.id;
    console.log("Utilisateur id", utilisateurId);
    const commandes = await commande.findAll({
        where: { utilisateur_id: utilisateurId },
        include: [
            {
                model: commandeProduit,
                include: [
                    {
                        model: produit,
                        attributes: ["nom", "prix", "tva_pourcentage"],
                    },
                ],
            },
        ],
        order: [["date_commande", "DESC"]],
    });

    if (!commandes.length) {
        return next(new AppError("Aucune commande trouvée", 404));
    }

    // Transformer les données pour obtenir la structure souhaitée
    const resultats = commandes.map((commande) => {
        return {
            idCommande: commande.id,
            date: commande.date_commande,
            statut: commande.statut,
            user: {
                id: req.utilisateur.id,
                nom: req.utilisateur.nom,
                email: req.utilisateur.email,
            },
            commande: commande.commandeProduits.map((cp) => {
                const prixUnitaire = +cp.produit.prix;
                const quantiteCommandee = cp.quantite;
                const TVA = +cp.produit.tva_pourcentage;
                const prixHT = prixUnitaire * quantiteCommandee;
                const prixAvecTVA = prixHT * (1 + TVA / 100);

                return {
                    idProduit: cp.produit_id,
                    nomProduit: cp.produit.nom,
                    quantiteCommandee: quantiteCommandee,
                    prixUnitaire: prixUnitaire,
                    TVA: TVA,
                    prixAvecTVA: prixAvecTVA,
                };
            }),
        };
    });

    return res.status(200).json({
        status: "success",
        data: resultats,
        message:
            "Voici les commandes de l'utilisateur avec détails utilisateur et produits.",
    });
});

/*                          Récupérer les commandes d'un utilisateur                     */
const getCommandesUtilisateurId = catchAsync(async (req, res, next) => {
    const utilisateurId = req.utilisateur.id;
    const commandeId = req.params.id;

    const commandes = await commande.findAll({
        where: { utilisateur_id: utilisateurId, id: commandeId },
        include: [
            {
                model: commandeProduit,
                include: [
                    {
                        model: produit,
                        attributes: ["nom", "prix", "tva_pourcentage", "image"],
                    },
                ],
            },
        ],
        order: [["date_commande", "DESC"]],
    });

    if (!commandes.length) {
        return next(new AppError("Aucune commande trouvée", 404));
    }

    // Transformer les données en fonction des besoins
    let sousTotal = 0;
    let total = 0;
    let dateCommande;
    const resultats = commandes
        .map((commande) => {
            dateCommande = commande.date_commande;
            return commande.commandeProduits.map((cp) => {
                const prixUnitaire = cp.produit.prix;
                const quantiteCommandee = cp.quantite;
                const TVA = cp.produit.tva_pourcentage;
                const prixHT = prixUnitaire * quantiteCommandee;
                sousTotal += prixHT;
                const prixAvecTVA = prixHT * (1 + TVA / 100);
                total += prixAvecTVA;
                return {
                    idCommande: commande.id,
                    idProduit: cp.produit_id,
                    nomProduit: cp.produit.nom,
                    quantiteCommandee: +quantiteCommandee,
                    prixUnitaire: +prixUnitaire,
                    TVA: +TVA,
                    prixAvecTVA: +prixAvecTVA,
                    image: cp.produit.image,
                    statut: commande.statut,
                };
            });
        })
        .flat();

    return res.status(200).json({
        status: "success",
        data: resultats,
        sousTotal,
        dateCommande,
        total,
        message: "Voici les commandes de l'utilisateur",
    });
});

const getCommandesById = catchAsync(async (req, res, next) => {
    const commandeId = req.params.id;

    const commandes = await commande.findOne({
        where: { id: commandeId },
        include: [
            {
                model: commandeProduit,
                include: [
                    {
                        model: produit,
                        attributes: ["nom", "prix", "tva_pourcentage", "image"],
                    },
                ],
            },
            {
                model: utilisateur, // On inclut l'utilisateur associé à la commande
                attributes: ["id", "nom", "prenom", "email"], // Sélection des attributs utilisateur
            },
            {
                model: livraison,
                attributes: [
                    "nom",
                    "prenom",
                    "email",
                    "phone",
                    "adresse",
                    "ville",
                    "code_postal",
                    "date_livraison",
                    "prescription",
                ],
            },
        ],
    });

    if (!commandes) {
        return next(new AppError("Aucune commande trouvée", 404));
    }
    // Transformer les données en fonction des besoins
    const resultats = {
        idUtilisateur: commandes.utilisateur.id, // ID de l'utilisateur
        nomUtilisateur: commandes.utilisateur.nom, // Nom de l'utilisateur
        prenomUtilisateur: commandes.utilisateur.prenom, // Prénom de l'utilisateur
        emailUtilisateur: commandes.utilisateur.email, // Email de l'utilisateur
        idCommande: commandes.id, // ID de la commande
        dateCommande: commandes.date_commande, // Date de la commande
        statut: commandes.statut,
        total: commandes.commandeProduits.reduce((acc, item) => {
            const prixTotal = item.quantite * item.produit.prix;
            const prixTVA = prixTotal * (item.produit.tva_pourcentage / 100);
            return acc + prixTotal + prixTVA;
        }, 0),
        produits: commandes.commandeProduits.map((cp) => {
            const prixUnitaire = cp.produit.prix;
            const quantiteCommandee = cp.quantite;
            const TVA = cp.produit.tva_pourcentage;
            const prixHT = prixUnitaire * quantiteCommandee;
            const prixAvecTVA = prixHT * (1 + TVA / 100);

            return {
                idProduit: cp.produit_id,
                nomProduit: cp.produit.nom,
                quantiteCommandee: quantiteCommandee,
                prixUnitaire: prixUnitaire,
                tva: +TVA,
                prixAvecTVA: prixAvecTVA,
                image: cp.produit.image,
            };
        }),
        livraison: commandes.livraison,
    };

    return res.status(200).json({
        data: resultats,
    });
});

// Mettre à jour le statut d'une commande
const mettreAJourStatutCommande = catchAsync(async (req, res, next) => {
    const commandeId = req.params.id;
    const { statut } = req.body;

    if (
        !["en attente", "en cours", "expediee", "livree", "annulee"].includes(
            statut
        )
    ) {
        return next(new AppError("Statut invalide", 400));
    }

    const commandeExistante = await commande.findByPk(commandeId);

    if (!commandeExistante) {
        return next(new AppError("Commande introuvable", 404));
    }

    commandeExistante.statut = statut;
    await commandeExistante.save();

    return res.status(200).json({
        status: "success",
        message: "Statut de la commande mis à jour avec succès",
    });
});

/*                          Supprimer une commande ainsi que ses commandeProduits                     */
const supprimerCommandesUtilisateurId = catchAsync(async (req, res, next) => {
    const utilisateurId = req.utilisateur.id;
    const commandeId = req.params.id;

    const commandes = await commande.findOne({
        where: { utilisateur_id: utilisateurId, id: commandeId },
        include: [
            {
                model: commandeProduit,
                include: [
                    {
                        model: produit,
                        attributes: ["nom", "prix", "tva_pourcentage"],
                    },
                ],
            },
        ],
    });

    if (!commandes) {
        return next(new AppError("Aucune commande trouvée", 404));
    }

    await commandeProduit.destroy({
        where: { commande_id: commandeId },
    });

    await livraison.destroy({
        where: { commande_id: commandeId },
    });

    await commande.destroy({
        where: { id: commandeId, utilisateur_id: utilisateurId },
    });

    return res.status(204).json({
        status: "success",
        message: "Commande et ses produits supprimés avec succès",
    });
});

const exportCommande = catchAsync(async (req, res, next) => {
    const commandes = await commande.findAll({
        include: [
            {
                model: commandeProduit,
                include: [
                    {
                        model: produit,
                        attributes: ["nom", "prix", "tva_pourcentage"],
                    },
                ],
            },
            {
                model: utilisateur, // On inclut l'utilisateur associé à la commande
                attributes: ["id", "nom", "prenom", "email"], // Sélection des attributs utilisateur
            },
        ],
    });

    if (!commandes.length) {
        return next(new AppError("Aucune commande trouvée", 404));
    }

    // Transformer les données en fonction des besoins
    const resultats = commandes.map((commande) => {
        return {
            idUtilisateur: commande.utilisateur.id, // ID de l'utilisateur
            nomUtilisateur: commande.utilisateur.nom, // Nom de l'utilisateur
            prenomUtilisateur: commande.utilisateur.prenom, // Prénom de l'utilisateur
            emailUtilisateur: commande.utilisateur.email, // Email de l'utilisateur
            idCommande: commande.id, // ID de la commande
            dateCommande: commande.date_commande, // Date de la commande
            statut: commande.statut,
            total: commande.commandeProduits.reduce((acc, item) => {
                const prixTotal = item.quantite * item.produit.prix;
                const prixTVA =
                    prixTotal * (item.produit.tva_pourcentage / 100);
                return acc + prixTotal + prixTVA;
            }, 0),
            // produits: commande.commandeProduits.map((cp) => {
            //     const prixUnitaire = cp.produit.prix;
            //     const quantiteCommandee = cp.quantite;
            //     const TVA = cp.produit.tva_pourcentage;
            //     const prixHT = prixUnitaire * quantiteCommandee;
            //     const prixAvecTVA = prixHT * (1 + TVA / 100);

            //     return {
            //         idProduit: cp.produit_id,
            //         nomProduit: cp.produit.nom,
            //         quantiteCommandee: quantiteCommandee,
            //         prixUnitaire: prixUnitaire,
            //         tva: +TVA,
            //         prixAvecTVA: prixAvecTVA,
            //     };
            // }),
        };
    });

    const csv = converter.toCSV(resultats, {delimiter: ',', wrap: false, headers: 'key'})
    res.setHeader(
        'Content-disposition',
      'attachment; filename=produits.csv'
    );

    res.setHeader('Content-type', 'application/vnd.ms-excel');
    return res.send(csv);

});

module.exports = {
    creerCommande,
    getCommandesUtilisateur,
    getCommandesUtilisateurs,
    getCommandesUtilisateurId,
    mettreAJourStatutCommande,
    supprimerCommandesUtilisateurId,
    getCommandesById,
    exportCommande
};
