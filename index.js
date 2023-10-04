
import { init_user_data } from "./src/services/csv-helper.js";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from "./src/configs/sequelize.js";

dotenv.config(); // Load .env file

export var app = express();
app.use(cors({ origin: "*" }));

const PORT = 8080;

sequelize.sync().then((result) => {

  console.log(result);

  app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
  });
  
  init_user_data("./user.csv");
})
.catch((err) => console.log(err));

export default app;
