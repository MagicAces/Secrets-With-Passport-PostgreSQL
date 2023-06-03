const crypto = require("crypto");
const queries = require(__dirname + "/query");
const pool = require("../db");
const bcrypt  = require("bcrypt");
const saltRounds = 11;

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
    
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(!err) {
            pool.query(queries.addUser, [username, hash], (error, results) => {
                error ?
                    res.render("/register"):
                    res.render("secrets");
            });
        }
        else
            res.send(err);
    });    
};

const verifyUser = (req, res) => {
    const {username, password} = req.body;
    
    pool.query(queries.verifyUser, [username], (err, results) => {
        if(err)
            res.send(err)
        else {
            if(results.rows.length) {
                results.rows.forEach(user => {
                    bcrypt.compare(password, user.password, (error, result) => {
                        result ?
                            res.render("secrets") :
                            res.redirect("/login");
                    });
                })
            } else {
                res.render("/login");
            }
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