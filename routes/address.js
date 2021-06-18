const express = require("express");

const jwt = require("jsonwebtoken");

const router = express.Router();
const addressController = require("../controllers/addressController");

router.get("/", async (req, res) => {
  let header = req.headers["authorization"];
  let token = header.split(" ")[1];
  let user = jwt.decode(token);
  let params = req.query
  let result = await addressController.allAddress(user.email, params);
  res.status(200).send(result.result);
})

router.post("/", async (req, res) => {
  let header = req.headers["authorization"];
  let token = header.split(" ")[1];
  let user = jwt.decode(token);
  let result = await addressController.addAddress(user.email, req.body);
  if (result.status) {
    res.status(201).send(result.result);
  } else {
    res.status(401).send(result.result);
  }
});

router.delete("/:id", async (req, res) => {
    let header = req.headers["authorization"];
    let token = header.split(" ")[1];
    let user = jwt.decode(token);
    let result = await addressController.deleteAddress(user.email, req.params.id);
    if (result.status) {
        res.status(201).send(result.result);
    } else {
        res.status(401).send(result.result);
    }
})

router.patch("/:id", async (req, res) => {
    let result = await addressController.updateAddress(req.params.id, req.body);
    if (result.status) {
        res.status(201).send(result.result);
    } else {
        res.status(401).send(result.result);
    }
})


module.exports = router;
