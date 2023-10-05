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
  decodeBase64(req.get("Authorization"))
    .then(async (decodeString) => {
      var user = null;

      user = {
        email: decodeString.split(":")[0],
        password: decodeString.split(":")[1],
      };

      const account = await Account.findOne({ where: { email: user.email } });

      if (!account || !(await account.validPassword(user.password))) {
        res.status(401).json(); // Unauthorized
        return;
      }

      await Assignment.findAll()
        .then((assignments) => {
          res.json(assignments).status(200);
          return;
        })
        .catch(() => {
          res.status(500).json();
          return;
        });
    })
    .catch(() => {
      res.status(403).json();
      return;
    });
});

// POST /v1/assignments - Create Assignment
router.post("/v1/assignments", jsonParser, (req, res) => {

  if(!req.get("Authorization")) {

    res.status(401).json();    
    return;
  }

  decodeBase64(req.get("Authorization"))
    .then(async (decodeString) => {

      const assignment = req.body;
      var user = null;
      
      user = {
        email: decodeString.split(":")[0],
        password: decodeString.split(":")[1],
      };

      const account = await Account.findOne({

        where: { email: user.email },
      
      }).catch((err) => {

        console.log(err);
        res.status(400).json();
      });

      if (!account || !(await account.validPassword(user.password))) {

        res.status(401).json(); // Unauthorized
        return;
      }

      assignment.userId = account.id;

      const searchAssignment = await Assignment.findOne({
        where: { name: assignment.name },
      }).catch((err) => {
        res.status(400).json();
      });

      if (searchAssignment) {

        res.status(400).json();

      } else {

        Assignment.create(assignment)
          .then((data) => {
            res.json(data).status(201);
          })
          .catch((err) => {
            console.log(err);
            res.json().status(400);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json().status(403);
    });
});

router.get("/v1/assignments/:id", async (req, res) => {

  if(!req.get("Authorization")) {

    res.status(401).json();    
    return;
  }

  decodeBase64(req.get("Authorization")).then(async (decodeString) => {
    
    var user = null;

    user = {
      email: decodeString.split(":")[0],
      password: decodeString.split(":")[1],      
    };

    const account = await Account.findOne({ where: { email: user.email } }).catch((err) => {
      
      console.log(err);
      res.send(401).json();
      return;
    });

    if (!account || !(await account.validPassword(user.password))) {

      res.status(401).json(); 
      return;
    }

    const assignmentId = req.params.id;
    const assignment = await Assignment.findOne({
      where: { id: assignmentId },
    });

    console.log("/v1/assignments:id get called");

    if (!assignment) {
      res.status(404).json();
    } else {
      res.json(assignment).status(200);
    }

  }).catch((err) => {
    
    console.log(err);
    res.status(403).json();
  });
});

router.delete("/v1/assignments/:id", async (req, res) => {
  
  if (!req.get("Authorization")) {
    res.status(401).json();
    return;
  }

  decodeBase64(req.get("Authorization")).then(async (decodeString) => {
    var user = null;

    user = {
      email: decodeString.split(":")[0],
      password: decodeString.split(":")[1],
    };

    const account = await Account.findOne({
      where: { email: user.email },
    }).catch((err) => {
      console.log(err);
      res.send(401).json();
      return;
    });

    if (!account || !(await account.validPassword(user.password))) {
      res.status(401).json();
      return;
    }

    try {
      const assignment = await Assignment.findOne({
        where: { id: req.params.id },
      });

      if (assignment) {
        assignment.destroy();

        res.status(204).json();
        return;
      } else {
        res.status(404).json();
        return;
      }
    } catch (error) {
      res.status(404).json();
      return;
    }
  }).catch((err) => {

    console.log(err);
    res.status(401).json();
  });
});

router.put("/v1/assignments/:id", jsonParser, async (req, res) => {
  
  const assignmentId = req.params.id;

  if (!req.get("Authorization")) {

    res.status(401).json();
    return;
  }

  decodeBase64(req.get("Authorization")).then(async (decodeString) => {
    var user = null;

    user = {
      email: decodeString.split(":")[0],
      password: decodeString.split(":")[1],
    };

    const account = await Account.findOne({
      where: { email: user.email },
    }).catch((err) => {
      console.log(err);
      res.send(401).json();
      return;
    });

    if (!account || !(await account.validPassword(user.password))) {
      res.status(401).json();
      return;
    }

    if (JSON.stringify(req.body) === "{}") {
      console.log("Empty body");
      res.status(400).json();
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
            .status(400)
            .json();
        }
      })
      .catch((error) => {
        console.error("Error updating assignment:", error);
        res.status(400).json();
      });
  }).catch((err) => {

    res.json().status(401);
  });
});

// ************* Default healthz apis *************
router.get("/healthz", (req, res) => {
  if (JSON.stringify(req.query) !== "{}") {
    res.status(400).json();
    return;
  }

  if (req.headers["content-length"] !== undefined) {
    console.log("req.body", req.headers["content-length"]);
    res.status(400).json();
    return;
  }

  console.log(req.query);

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
      res.status(200).json();
      return;
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
      res.status(503).json();
    });
});

router.use("*", (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");

  res.status(405).json();
});

export default router;
