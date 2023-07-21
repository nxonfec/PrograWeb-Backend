import {sequelize} from "../database/database.js";
import {User} from "./User.js";
import {DataTypes} from "sequelize";

export const Teacher = sequelize.define("Teacher", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {
        type: DataTypes.STRING
    },
    grade: {
        type: DataTypes.STRING
    },
    profession: {
        type: DataTypes.STRING
    },
    presentation: {
        type: DataTypes.STRING
    },
    university: {
        type: DataTypes.STRING
    },
    course: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

Teacher.belongsTo(User, { foreignKey: "user_id" });