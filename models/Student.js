import {sequelize} from "../database/database.js";
import {DataTypes} from "sequelize";
import {User} from "./User.js";

export const Student = sequelize.define("Student", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {
        type: DataTypes.STRING
    },
    university: {
        type: DataTypes.STRING
    },
    career: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

Student.belongsTo(User, { foreignKey: "user_id" });
