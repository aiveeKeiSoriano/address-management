const express = require("express");

const jwt = require("jsonwebtoken");

const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let result = await userController.addUser(req.body);
  if (result.status) {
    res.status(201).send(result.result);
  } else {
    res.status(401).send(result.result);
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  let result = await userController.findUser(req.body);
  if (result.status) {
    let payload = {
      email: result.result.email,
    };
    let refresh = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    });
    let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
    let addRefresh = await userController.addRefresh(
      result.result.email,
      refresh
    );
    if (addRefresh.status) {
      res.status(200).send({ access_token: token, refresh_token: refresh });
    } else {
      res.status(401).send(result.result);
    }
  } else {
    res.status(401).send(result.result);
  }
});

let verifyToken = (req, res, next) => {
    let header = req.headers['authorization']
    if (!header) {
      res.status(403).json({ message: "Need access token" })
    }
    else {
      let token = header.split(' ')[1]
      try {
        let user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next()
      }
      catch (e) {
        res.status(403).json({ message: "Invalid access token" })
      }
    }
  }

router.post('/logout', verifyToken, async (req, res) => {
    let header = req.headers['authorization']
    let token = header.split(' ')[1]
    let user = jwt.decode(token)
    let result = await userController.deleteRefresh(user.email)
    if (result.status) {
        res.status(200).send(result.result);
    }
    else {
        res.status(401).send(result.result);
    }
})


router.post("/token", async (req, res) => {
    const { refresh } = req.body;
    console.log("refresh")
      try {
        let user = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
        let check = await userController.checkRefresh(user.email, refresh)
          if (check.status) {
              let payload = {
                  email: user.email,
              };
              let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                  expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
              });
              res.status(200).send({ access_token: token });
          }
          else {
            res.status(403).send(check.result);
          }
      } catch (e) {
        res.status(403).send({ message: "Invalid refresh token" });
      }
  });

module.exports = router;
