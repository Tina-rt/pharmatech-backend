const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";

const config = require("./config");

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
});

module.exports = sequelize;
