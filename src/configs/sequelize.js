import { Sequelize } from "sequelize";

// TODO : implement .env 
const sequelize = new Sequelize("saiDB", "root", "The1m@m@", {
    host: "localhost",
    dialect: "mysql",
});

export default sequelize;