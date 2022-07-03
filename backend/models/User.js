import { DataTypes } from "sequelize";
import { db } from "../database/db.js"
import bcrypt from "bcryptjs";

const User = db.define('user', 
    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
    },
    { //hook to hash the password before storing the user info in the database
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            }
        }
        }
    }
);

User.sync();

export default User;