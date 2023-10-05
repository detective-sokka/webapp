import { DataTypes } from "sequelize";
import Assignment from "./Assignment.js";
import sequelize from "../configs/sequelize.js";
import bcrypt from "bcrypt";

export const Account = sequelize.define("Account", {
  
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,    
    readOnly: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

}, {
  tableName: "Account"
});

Account.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

Account.hasMany(Assignment, {foreignKey: 'userId'});

export default Account;