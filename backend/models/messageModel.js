const sequelize = require("../src/db")
const { DataTypes } = require("sequelize")

const Messages = sequelize.define("Messages", {
    id: {
        type: DataTypes.UUID,
        
        
    }
    
})
