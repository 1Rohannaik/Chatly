const { DataTypes } = require("sequelize")
const sequelize = require("../src/db")

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        minlength: 6,
    },
    profilePic: {
        type: DataTypes.STRING,
        defaultValue: ""
    }
},
    { timestamps: true }
);

module.exports = User;