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
          const updatedAssignemts = assignments.map((model) => ({
            id: model.id,
            assignment_created: model.createdAt,
            assignment_updated: model.updatedAt,
            model_name: model.name,
            model_points: model.points,
            num_of_attempts: model.num_of_attempts,
            deadline: model.deadline,
          }));

          res.json(updatedAssignemts).status(200);
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
router.post("/v1/assignments", jsonParser, async (req, res) => {

  if (!req.get("Authorization")) {
    res.status(401).json();
    return;
  }

  try {
    const decodeString = await decodeBase64(req.get("Authorization"));
    const assignment = req.body;
    var user = null;

    user = {
      email: decodeString.split(":")[0],
      password: decodeString.split(":")[1],
    };

    const account = await Account.findOne({
      where: { email: user.email },
    });

    if (!account || !(await account.validPassword(user.password))) {
      res.status(401).json(); // Unauthorized
      return;
    }

    assignment.userId = account.id;

    if ( parseInt(assignment.num_of_attempts) < 1 || parseInt(assignment.num_of_attempts) > 100 || parseInt(assignment.points) < 1 || parseInt(assignment.points) > 100) {
      
      res.status(400).json();
      return;
    }

    const data = await Assignment.create(assignment);
    const updatedAssignemts = {
      id: data.id,
      assignment_created: data.createdAt,
      assignment_updated: data.updatedAt,
      model_name: data.name,
      model_points: data.points,
      num_of_attempts: data.num_of_attempts,
      deadline: data.deadline,
    };

    res.statusCode = 201;
    res.statusMessage = "Assignment Created";
    res.json(updatedAssignemts);
    return;

  } catch (error) {

    console.log(error);
    res.json().status(400);
  }
});

router.get("/v1/assignments/:id", async (req, res) => {
  if (!req.get("Authorization")) {
    res.status(401).json();
    return;
  }

  decodeBase64(req.get("Authorization"))
    .then(async (decodeString) => {
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

      const assignmentId = req.params.id;
      const assignment = await Assignment.findOne({
        where: { id: assignmentId },
      });

      console.log("/v1/assignments:id get called");

      if (!assignment) {
        res.status(404).json();
        return;
      } else {
        const updatedAssignemts = {
          id: assignment.id,
          assignment_created: assignment.createdAt,
          assignment_updated: assignment.updatedAt,
          model_name: assignment.name,
          model_points: assignment.points,
          num_of_attempts: assignment.num_of_attempts,
          deadline: assignment.deadline,
        };

        res.json(updatedAssignemts).status(200);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(403).json();
    });
});

router.delete("/v1/assignments/:id", async (req, res) => {
  if (!req.get("Authorization")) {
    res.status(401).json();
    return;
  }

  decodeBase64(req.get("Authorization"))
    .then(async (decodeString) => {
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
        res.status(403).json();
        return;
      }

      try {
        const assignment = await Assignment.findOne({
          where: { id: req.params.id },
        });

        if (assignment.userId !== account.id) {
          res.status(401).json();
          return;
        }

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
    })
    .catch((err) => {
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

  decodeBase64(req.get("Authorization"))
    .then(async (decodeString) => {
      var user = null;

      user = {
        email: decodeString.split(":")[0],
        password: decodeString.split(":")[1],
      };

      const account = await Account.findOne({
        where: { email: user.email },
      });

      if (!account || !(await account.validPassword(user.password))) {
        res.status(403).json();
        return;
      }

      if (JSON.stringify(req.body) === "{}") {
        throw new Error("Empty body");
      }

      const assignment = await Assignment.findOne({
        where: { id: assignmentId },
      });

      if (account.id !== assignment.userId) {
        res.status(401).json();
        return;
      }

      try {
        const result = await Assignment.update(req.body, {
          where: { id: assignmentId },
        });

        if (result[0] === 1) {
          // The update was successful
          res.status(204).json();
          return;
        } else {
          // No rows were updated (assignmentId might not exist)
          res.json().status(400);
          return;
        }
      } catch (error) {
        res.json().status(400);
        return;
      }
    })
    .catch(() => {
      res.json().status(400);
    });
});

// ************* Default healthz apis *************
router.get("/healthz", (req, res) => {
  if (JSON.stringify(req.query) !== "{}") {
    res.status(400).json();
    return;
  }

  if (req.headers["content-length"] !== undefined) {
    res.status(400).json();
    return;
  }

  sequelize
    .authenticate()
    .then(() => {
      res.status(200).json();
      return;
    })
    .catch((error) => {
      res.status(503).json();
    });
});

router.use("*", (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");

  res.status(405).json();
});

export default router;
