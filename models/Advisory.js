import {sequelize} from "../database/database.js";
import {DataTypes} from "sequelize";

export const Advisory = sequelize.define("Advisory", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    teacher_id: {
        type: DataTypes.INTEGER
    },
    teacher_name: {
        type: DataTypes.STRING
    },
    student_id: {
        type: DataTypes.INTEGER
    },
    student_name: {
        type: DataTypes.STRING
    },
    date_timestamp: {
        type: DataTypes.BIGINT
    },
    link: {
        type: DataTypes.STRING,
    }
}, {
    freezeTableName: true
})