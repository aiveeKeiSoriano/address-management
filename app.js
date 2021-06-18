require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const app = express();
app.use(morgan("dev"));
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('connected'))

const authRouter = require("./routes/auth")
const addressRouter = require("./routes/address")

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

app.use('/address', verifyToken, addressRouter)
app.use('/auth', authRouter)


const PORT = 3300;
app.listen(PORT, () => {
  console.log("server is listening at http://localhost:" + PORT);
});