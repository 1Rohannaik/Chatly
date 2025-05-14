require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Ensures SSL is used
        rejectUnauthorized: false, // Allows self-signed certificates (for Render)
      },
    },
    logging: false, // Optional: disables raw SQL logs
  }
);

module.exports = sequelize;
