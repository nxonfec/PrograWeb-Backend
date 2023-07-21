import {sequelize} from "../database/database.js";
import {DataTypes} from "sequelize";
import {Teacher} from "./Teacher.js";

export const Schedule = sequelize.define("Schedule", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    day: {
        type: DataTypes.STRING
    },
    initHour: {
        type: DataTypes.STRING
    },
    endHour: {
        type: DataTypes.STRING
    },
    link: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});
Schedule.belongsTo(Teacher, { foreignKey: "user_id" });
