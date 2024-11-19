const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const methodePaiement = sequelize.define(
    "methodepaiement",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Veuillez mettre la references du paiements",
                },
            },
        },
        description : {
            type: DataTypes.STRING(200),
            allowNull: true,
           
        },
        createdAt: {
            type: DataTypes.DATE,
            default: Date.now(),
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        paranoid: true,
        freezeTableName: true,
        modelName: "paiement",
    }
);


module.exports = methodePaiement;