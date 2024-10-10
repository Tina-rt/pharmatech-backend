require("dotenv").config({ path: process.cwd() + "/.env" });


const fs = require("fs");
const path = require("path");
// const sequelize = require("./config/database");
const Sequelize = require("sequelize");


const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 3600
    },
  });

async function runMigrations() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Get all migration files
        const migrationsPath = path.join(__dirname, "db/migrations");
        const migrationFiles = fs
            .readdirSync(migrationsPath)
            .filter((file) => file.endsWith(".js"));

        // Execute each migration
        for (const file of migrationFiles) {
            const migrationFile = require(path.join(migrationsPath, file));

            try {
                await migrationFile.up(
                    sequelize.getQueryInterface(),
                    Sequelize
                );
                console.log(`Migration ${file} executed successfully.`);
            } catch (error) {
                console.error(`Error executing migration ${file}:`, error);
                throw error;
            }
        }

        console.log("All migrations were executed successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

runMigrations().catch(console.error);
