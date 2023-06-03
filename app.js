//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ejs = require("ejs");
const controller = require(__dirname + "/src/controller");

const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

passport.use( 
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        controller.userStrategy
    )
);

passport.serializeUser(controller.serializeUser);
passport.deserializeUser(controller.deserializeUser);

app.get("/", controller.getHome);
app.get("/register", controller.getRegister);
app.get("/login",  controller.getLogin);
app.get("/secrets", controller.getSecrets);
app.get("/logout", controller.getLogout);
app.post("/register", controller.addUser);
app.post("/login", controller.verifyUser);

app.listen(4000, () => {
    console.log("Server listening on port 4000");
});