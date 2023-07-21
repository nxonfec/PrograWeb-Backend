import {sequelize} from "../database/database.js";
import {DataTypes} from "sequelize";

export const University = sequelize.define("University", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true
});