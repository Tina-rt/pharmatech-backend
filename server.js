require("dotenv").config({ path: process.cwd() + "/.env" });

const express = require("express");
const app = express();
const port = process.env.APP_PORT;

app.use(express.json());

const authRouter = require("./route/authRoute");
const produitRouter = require("./route/produitRoute");
const categorieRouter = require("./route/categorieRoute");
const panierRouter = require("./route/panierRoute");
const commandeRouter = require("./route/commandeRoute");
const methodeLivraisonRouter = require("./route/methodeLivraisonRoute");
const LivraisonRouter = require("./route/livraisonRoute");
const factureRouter = require("./route/factureRoute");
const paiementRouter = require("./route/paiementRoute");

const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const { stack } = require("sequelize/lib/utils");
const globalErrorHandler = require("./controller/errorController");

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API Rest Marche bien dans Pharmatech Back end",
  });
});

//tous les routes
app.use("/api/auth", authRouter); //route pour authentification
app.use("/api/produit", produitRouter); //route pour produit
app.use("/api/categorie", categorieRouter); //route pour categorie
app.use("/api/panier", panierRouter); //route pour panier
app.use("/api/commande", commandeRouter); //route pour commande
app.use("/api/methodeLivraison", methodeLivraisonRouter); //route pour methode livraison
app.use("/api/livraison", LivraisonRouter); //route pour  livraison
app.use("/api/facture", factureRouter); //route pour methode facture
//app.use("/api/paiement", paiementRouter); //route pour  paiement
app.use("/upload", express.static(path.join(__dirname, "upload")));

//Route indisponnible
app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError("La page n'existe pas", 404);
  })
);

app.use(globalErrorHandler);

app.listen(port, () =>
  console.log(`Pharmatech back end sur le port :  ${port}!`)
);
