import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const userName = process.env.DB_USERNAME || 'sai';
const password = process.env.DB_PASSWORD || 'sai';
const ipAddress = process.env.DB_IPADDRESS || '127.0.0.1';
const dialect = process.env.DB_DIALECT || 'mysql';
const dbName = process.env.DB_NAME || 'saiDB';

const sequelize = new Sequelize({
    host: ipAddress,
    dialect: dialect,
    database: dbName, 
    username: userName, 
    password: password,
});


export default sequelize;
