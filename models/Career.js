import {sequelize} from "../database/database.js";
import {DataTypes} from "sequelize";

export const Career = sequelize.define("Career", {
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