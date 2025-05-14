const sequelize = require("../lib/db");
const { DataTypes } = require("sequelize");

const Messages = sequelize.define(
  "Messages",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false, // Corrected from require: true to allowNull: false
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false, // Corrected from require: true to allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Messages;
