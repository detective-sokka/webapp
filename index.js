import express from "express";
import cors from "cors";
import Sequelize from "sequelize";
import mysql from "mysql2/promise";

const PORT = 8080;

var app = express();

app.use(cors({ origin: "*" }));

app.get("/healthz", (req, res) => {
  
  if (req.body) {
    res.sendStatus(400);
  }

  mysql
    .createConnection({
      user: "root",
      password: "root",
    })
    .then((connection) => {
      connection.query("CREATE DATABASE IF NOT EXISTS saiDB;").then(() => {
        // establish connection to db
        const sequelize = new Sequelize("saiDB", "root", "root", {
          host: "localhost",
          dialect: "mysql",
        });

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

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

export default app;
