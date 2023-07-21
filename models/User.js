import {sequelize} from "../database/database.js";
import {DataTypes} from "sequelize";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    },
    dni: {
        type: DataTypes.STRING
    },
    user: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});