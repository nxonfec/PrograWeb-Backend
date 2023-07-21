import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
   host: process.env.PGHOST,
   dialect: "postgres"
});
