import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const userName = process.env.DB_USERNAME || "root";
const password = process.env.DB_PASSWORD || "root";


const sequelize = new Sequelize("saiDB", userName, password, {
    host: "127.0.0.1",
    dialect: "mysql",
});


export default sequelize;
