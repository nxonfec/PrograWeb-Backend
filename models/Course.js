import {sequelize} from "../database/database.js";
import {DataTypes} from "sequelize";

export const Course = sequelize.define("Course", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true
})