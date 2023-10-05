import { init_user_data } from "./src/services/csv-helper.js";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from "./src/configs/sequelize.js";
import routes from "./src/routes/Routes.js";
import bodyParser from "body-parser";

const jsonParser = bodyParser.json();

dotenv.config(); // Load .env file

export var app = express();
app.use(cors({ origin: "*" }));
app.use(routes);
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));


const PORT = 8080;

sequelize.sync().then((result) => {

  app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
  });
  
  init_user_data("./user.csv");
})
.catch((err) => console.log(err));

export default app;
