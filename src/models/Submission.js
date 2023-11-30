import { Model, DataTypes } from 'sequelize';
import sequelize from "../configs/sequelize.js";

class Submission extends Model {}

Submission.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true, 
    allowNull: false,
    readOnly: true,
  },
  assignment_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  submission_url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true // validate as URL
    }
  },
}, {
  sequelize,
  modelName: 'Submission',
});

sequelize.sync();

export default Submission;