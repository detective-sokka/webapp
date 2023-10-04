import app from "../../index";
import mysql from "mysql2/promise";
import sequelize from "../configs/sequelize";

app.get("/healthz", (req, res) => {
  
    if (req.body) {
      res.sendStatus(400);
    }
  
    mysql
    .createConnection({
      user: "root",
      password: "The1m@m@",
    })
    .then((connection) => {
      connection.query("CREATE DATABASE IF NOT EXISTS saiDB;").then(() => {
        // establish connection to db
        res.setHeader("Cache-Control", "no-cache");
  
        sequelize
          .authenticate()
          .then(() => {
            console.log("Connection has been established successfully.");
            res.sendStatus(200);
          })
          .catch((error) => {
            console.error("Unable to connect to the database: ", error);
            res.sendStatus(503);
          });

      });
    });
  
});
