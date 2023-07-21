import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL,
   {
      dialect: "postgres",
      dialectOptions: {
         ssl: {
            require: true,
            rejectUnauthorized: false
         }
      }
   });
