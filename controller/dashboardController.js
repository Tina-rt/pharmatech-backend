const commande = require("../db/models/commande");
const produit = require("../db/models/produit");
const utilisateur = require("../db/models/utilisateur");
const catchAsync = require("../utils/catchAsync");
const sequelize = require("../config/database");

const getDashboardData = catchAsync(async (req, res, next) => {
    const [results, metadata] = await sequelize.query(
        'Select sum("prixHTtotal" ) as total, sum(quantite) as quantitePrCommandee from "commandeProduit" as cp  left join produit as pr on cp.produit_id = pr.id'
    );

    let totalRecette = 0;
    let totalProduitsCommandee = 0;

    console.log(results);

    if (results.length > 0) {
        const { total, quantiteprcommandee } = results[0];
        totalRecette = +total;
        totalProduitsCommandee = +quantiteprcommandee;
    }

    const produits = await produit.count();

    const utilisateurs = await utilisateur.count();
    const commandes = await commande.findAll();
    const [salesDataGraph, _] = await sequelize.query(`
        Select 
            TO_CHAR(date_commande, 'MM/DD/YYYY') as date,
            count(*) as value
            
            from "commande"

            group by date
            order by date
	
        `);
    const [salesAmountGraph, __] =
        await sequelize.query(`Select sum("prixHTtotal") as value, TO_CHAR("createdAt", 'MM/DD/YYYY') as date from "commandeProduit" as cp 
	group by date order by date`);

    const [totalProduitOrderedGraph, ___] =
        await sequelize.query(`Select produit.nom as label, count(*) as value from "commandeProduit" as cp left join produit on produit.id = cp.produit_id
group by produit.id order by value desc limit 10`);
    // const totalCommande = await commande.count();

    return res.json({
        status: "success",
        data: {
            orderedProduitGraph: totalProduitOrderedGraph,
            salesAmountGraph,
            salesDataGraph,
            commandes: commandes,
            recetteTotal: totalRecette,
            totalProduitsCommandee,
            produits: produits,
            utilisateurs: utilisateurs.length,
        },
        message: "Voici les données du tableau de bord",
    });
});

module.exports = {
    getDashboardData,
};
