import { DataTypes } from "sequelize";
import sequelize from "../configs/sequelize.js";

const Assignment = sequelize.define("assignment", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    readOnly: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100,
    },
  },
  num_of_attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100,
    },
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, {
  tableName: "Assignment"
});

export default Assignment;