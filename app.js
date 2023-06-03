//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const controller = require(__dirname + "/src/controller");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", controller.getHome);
app.get("/register", controller.getRegister);
app.get("/login", controller.getLogin);
app.post("/register", controller.addUser);
app.post("/login", controller.verifyUser);

app.listen(4000, () => {
    console.log("Server listening on port 4000");
});