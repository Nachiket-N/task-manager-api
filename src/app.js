const express = require("express");
require("./db/mongoose");
const userRouter = require("../src/routers/User.js");
const taskRouter = require("../src/routers/Task.js");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
