import express from "express";
import sequelize from "../configs/sequelize.js";
import Assignment from "../models/Assignment.js";
import bodyParser from "body-parser";
import { decodeBase64 } from "../services/encryption.js";
import Account from "../models/Account.js";
import winston from "winston";
import "winston-cloudwatch";
import StatsD from 'node-statsd';

const jsonParser = bodyParser.json();
const router = express.Router();


const client = new StatsD();

export const logger = winston.createLogger({
  
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});


// GET /v1/assignments - Get List of All Assignments
router.get("/v1/assignments", (req, res) => {

  client.increment('GET_ALL');

  decodeBase64(req.get("Authorization"))
    .then(async (decodeString) => {

      var user = null;      
      user = {
        email: decodeString.split(":")[0],
        password: decodeString.split(":")[1],
      };

      const account = await Account.findOne({ where: { email: user.email } });

      if (!account || !(await account.validPassword(user.password))) {
        
        logger.error("401 error");
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

          logger.info("GET: GET all assignments executed sucessfully");
          res.json(updatedAssignemts).status(200);          
          return;
        })
        .catch(() => {

          logger.error("500 error");
          res.status(500).json();
          return;
        });
    })
    .catch(() => {

      logger.error("403 error");
      res.status(403).json();
      return;
    });
});

// POST /v1/assignments - Create Assignment
router.post("/v1/assignments", jsonParser, async (req, res) => {

  client.increment('POST_REQ');
  if (!req.get("Authorization")) {

    logger.error("401 error");
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
      
      logger.error("401 error");
      res.status(401).json(); // Unauthorized
      return;
    }

    assignment.userId = account.id;

    if ( parseInt(assignment.num_of_attempts) < 1 || parseInt(assignment.num_of_attempts) > 100 || parseInt(assignment.points) < 1 || parseInt(assignment.points) > 100) {
      
      logger.error("400 error");
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
    logger.info("POST: Assignment created sucessfully");
    res.json(updatedAssignemts);
    return;

  } catch (error) {

    logger.error("400 error");
    res.json().status(400);
  }
});

router.get("/v1/assignments/:id", async (req, res) => {
  
  client.increment('GET_ID');

  if (!req.get("Authorization")) {
    
    logger.error("401 error");
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
        
        logger.error("401 error");
        res.send(401).json();
        return;
      });

      if (!account || !(await account.validPassword(user.password))) {

        logger.error("401 error");
        res.status(401).json();
        return;
      }

      const assignmentId = req.params.id;
      const assignment = await Assignment.findOne({
        where: { id: assignmentId },
      });

      if (!assignment) {
        
        logger.error("404 error");
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

        logger.info("Get:id sucessfully");
        res.json(updatedAssignemts).status(200);
        
        return;
      }
    })
    .catch((err) => {
      
      logger.error("403 error");
      res.status(403).json();
    });
});

router.delete("/v1/assignments/:id", async (req, res) => {
  
  client.increment('DELETE_ID');

  if (!req.get("Authorization")) {
    
    logger.error("401 error");
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

        logger.error("401 error");
        res.send(401).json();
        return;
      });

      if (!account || !(await account.validPassword(user.password))) {
        
        logger.error("403 error");
        res.status(403).json();
        return;
      }

      try {
        const assignment = await Assignment.findOne({
          where: { id: req.params.id },
        });

        if (assignment.userId !== account.id) {
          
          logger.error("401 error");
          res.status(401).json();
          return;
        }

        if (assignment) {
          assignment.destroy();

          logger.info("DELETE : Assignment deleted sucessfully");
          res.status(204).json();          
          return;

        } else {

          logger.error("400 error");
          res.status(404).json();
          return;
        }
      } catch (error) {
        logger.error("400 error");
        res.status(404).json();
        return;
      }
    })
    .catch((err) => {
      
      logger.error("401 error");
      res.status(401).json();      
    });
});

router.put("/v1/assignments/:id", jsonParser, async (req, res) => {
  const assignmentId = req.params.id;

  client.increment('PUTID');

  if (!req.get("Authorization")) {
    
    logger.error("401 error");
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
        logger.error("403 error");
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
        logger.error("401 error");
        return;
      }

      try {
        const result = await Assignment.update(req.body, {
          where: { id: assignmentId },
        });

        if (result[0] === 1) {
          // The update was successful
          res.status(204).json();
          logger.info("PUT : Assignment updated sucessfully");
          return;
        } else {
          // No rows were updated (assignmentId might not exist)
          res.json().status(400);
          logger.error("400 error");
          return;
        }
      } catch (error) {
        res.json().status(400);
        logger.error("400 error");
        return;
      }
    })
    .catch(() => {
      res.json().status(400);
      logger.error("400 error");
    });
});

// ************* Default healthz apis *************
router.get("/healthz", (req, res) => {

  client.increment('GETHEALTHZ');
  if (JSON.stringify(req.query) !== "{}") {
    res.status(400).json();
    logger.error("400 error");
    return;
  }

  if (req.headers["content-length"] !== undefined) {
    
    res.status(400).json();
    logger.error("400 error");
    return;
  }

  sequelize
    .authenticate()
    .then(() => {
      
      logger.info("Healthz successful");
      res.status(200).json();      
      return;
    })
    .catch((error) => {
      
      logger.error("Healthz Error");
      res.status(503).json();
    });
});

router.use("*", (req, res, next) => {

  client.increment('MISCREQ');
  res.setHeader("Cache-Control", "no-cache");

  res.status(405).json();
  logger.error("405 error");
});

export default router;
