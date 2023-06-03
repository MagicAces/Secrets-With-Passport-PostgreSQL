const crypto = require("crypto");
const queries = require(__dirname + "/query");
const pool = require("../db");
const md5 = require("md5");


const getHome = (req, res) => {
    res.render("home");
};

const getRegister = (req, res) => {
    res.render("register");
};

const getLogin = (req, res) => {
    res.render("login");
};

const addUser = (req, res) => {
    const {username, password} = req.body;
    
    pool.query(queries.addUser, [username, md5(password)], (err, results) => {
        err ? res.render(err) : res.render("secrets");
    });
};

const verifyUser = (req, res) => {
    const {username, password} = req.body;
    
    pool.query(queries.verifyUser, [username, md5(password)], (err, results) => {
        if(err)
            res.send(err)
        else {
            results.rows.length ?
                res.render("secrets"):
                res.redirect("/login");
        }
    });
}

module.exports = {
    getHome,
    getRegister,
    getLogin,
    addUser,
    verifyUser,
}