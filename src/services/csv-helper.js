import * as fs from "fs";
import { parse } from "csv-parse";
import Account from "../models/Account.js";
import { encryptPassword } from "./encryption.js";

export const read_csv = async (filename) => {
  fs.createReadStream(filename)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", (row) => {
      console.log(row);
    })
    .on("end", () => {
      console.log("file read completed");
    })
    .on("error", (error) => {
      console.log(error);
    });
};

export const init_user_data = async (filename) => {
  fs.createReadStream(filename)
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", (row) => {
      console.log(row);

      var account_data = {
        first_name: row[0],
        last_name: row[1],
        email: row[2],
        password: "",
      };

      encryptPassword(row[3])
        .then((data) => {          
          account_data.password = data;
          
          Account.findOrCreate({where: {email: account_data.email}, 
            defaults: 
              account_data
            })
            .then(() => {
              console.log("Account created");
            })
            .catch((error) => {
              console.error("Error creating Account:", error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .on("end", () => {
      console.log("file read completed");
    })
    .on("error", (error) => {
      console.log(error);
    });
};
