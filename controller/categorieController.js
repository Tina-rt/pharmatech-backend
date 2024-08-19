const categorie = require("../db/models/categorie");
const catchAsync = require("../utils/catchAsync");

const creerCategorie = catchAsync(async (req, res, next) => {
  const body = req.body;

  const nouveauCategorie = await categorie.create({
    nom: body.nom,
  });

  return res.status(201).json({
    status: "Success",
    data: nouveauCategorie,
  });
});

module.exports = { creerCategorie };
