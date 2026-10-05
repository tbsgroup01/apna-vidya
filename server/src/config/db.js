const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME || "apnavidya",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || "mysql",
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();

        console.log("Database connection established successfully.");
    } catch (err) {
        console.error("Unable to connect to database:", err.message);
        throw err;
    }
};

module.exports = { sequelize, connectDB };

