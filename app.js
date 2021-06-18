require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();
app.use(morgan("dev"));
app.use(express.json())

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('connected'))

const authRouter = require("./routes/auth")
app.use('/auth', authRouter)


const PORT = 3300;
app.listen(PORT, () => {
  console.log("server is listening at http://localhost:" + PORT);
});