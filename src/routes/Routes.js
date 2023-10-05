import express from "express";
import sequelize from "../configs/sequelize.js";
import Assignment from "../models/Assignment.js";
import bodyParser from "body-parser";
import { decodeBase64 } from "../services/encryption.js";
import Account from "../models/Account.js";

const jsonParser = bodyParser.json();
const router = express.Router();

// GET /v1/assignments - Get List of All Assignments
router.get("/v1/assignments", (req, res) => {
  // TODO: Get from db
  decodeBase64(req.get("Authorization"))
    .then(async (decodeString) => {
      var user = null;

      user = {
        email: decodeString.split(":")[0],
        password: decodeString.split(":")[1],
      };

      const account = await Account.findOne({ where: { email: user.email } });

      if (!account || !(await account.validPassword(user.password))) {
        res.sendStatus(401); // Unauthorized
        return;
      }

      const assignments = await Assignment.findAll({
        where: { userId: account.id },
      });
      res.json(assignments).status(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(503);
      return;
    });
});

// POST /v1/assignments - Create Assignment
router.post("/v1/assignments", jsonParser, (req, res) => {
  decodeBase64(req.get("Authorization"))
    .then((decodeString) => {
      const assignment = req.body;
      var user = null;

      console.log("decoded", decodeString);

      user = {
        email: decodeString.split(":")[0],
        password: decodeString.split(":")[1],
      };

      Account.findOne({ where: { email: user.email } })
        .then(async (data) => {
          if (await data.validPassword(user.password)) {
            assignment.userId = data.id;
            Assignment.create(assignment)
              .then((data) => {
                // TODO: add to db
                res.json(data).status(201);
              })
              .catch((err) => {
                console.log(err);
                res.json({ error: "Invalid/duplicate data" }).status(503);
              });
          } else {
            res.sendStatus(503);
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log("Error decoding"));
});

router.get("/v1/assignments/:id", async (req, res) => {
  const assignmentId = req.params.id;
  const assignment = await Assignment.findOne({ where: { id: assignmentId } });

  // TODO: Get Assignment based on id
  console.log("/v1/assignments:id get called");

  if (!assignment) {
    res.status(404).json({ error: "Assignment not found" });
  } else {
    res.json(assignment);
  }
});

router.delete("/v1/assignments/:id", async (req, res) => {
  try {
    console.log("/v1/assignments:id delete called");
    const assignment = await Assignment.findOne({
      where: { id: req.params.id },
    });

    if (assignment) {
      assignment.destroy();

      res.status(204).json({ message: "Assignment deleted!" });
      return;
    } else {
      res.status(500).json({ message: "Assignment not found" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Execution error" });
  }
});

router.put("/v1/assignments/:id", jsonParser, async (req, res) => {
  const assignmentId = req.params.id;

  if (JSON.stringify(req.body) === "{}") {
    console.log("Empty body");
    res.status(404).json({ error: "Empty body" });
    return;
  }

  await Assignment.update(req.body, {
    where: { id: assignmentId },
  })
    .then((result) => {
      if (result[0] === 1) {
        // The update was successful
        res.sendStatus(204);
      } else {
        // No rows were updated (assignmentId might not exist)
        res
          .status(404)
          .json({ error: "No matching assignment found for update" });
      }
    })
    .catch((error) => {
      console.error("Error updating assignment:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// ************* Default healthz apis *************
router.get("/healthz", (req, res) => {
  if (JSON.stringify(req.query) !== "{}") {
    res.sendStatus(400);
  }
  console.log(req.query);

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
      res.sendStatus(200);
      return;
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
      res.sendStatus(503);
    });
});

router.use("*", (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");

  res.sendStatus(405);
});

export default router;
