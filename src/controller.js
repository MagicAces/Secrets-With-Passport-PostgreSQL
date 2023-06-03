const crypto = require("crypto");
const queries = require(__dirname + "/query");
const pool = require("../db");
const bcrypt  = require("bcrypt");
const saltRounds = 10;


const User = {
    findByEmail: async (email) => {
        const results = await pool.query(queries.verifyEmail, [email]);
        return results;
    },
    findById: async (id) => {
        const results = await pool.query(queries.verifyId, [id]);
        return results;
        
    },
    createUser: async (email, password) => {
        const hash = await bcrypt.hash(password, saltRounds);
        const results = await pool.query(queries.addUser, [email, hash]);
        return results;
    }
}

const getHome = (req, res) => {
    res.render("home");
};

const getRegister = (req, res) => {
    res.render("register");
};

const getLogin = (req, res) => {
    res.render("login");
};

const addUser =  (req, res) => {
    const {username, password} = req.body;

    const results = User.createUser(username, password);

    results
        .then(data => {
            req.login(data.rows[0], (err) => {
                if(err)
                    res.redirect("/register");
                res.redirect("/secrets");
            })
        })
        .catch(err => res.redirect("/register"));
};

const verifyUser = (req, res) => {
    const {username, password} = req.body;
    const results = User.findByEmail(username);
    
    results
        .then(data => {
            if(data.rows.length) {
                bcrypt.compare(password, data.rows[0].password, (error, result) => {
                    if(error)
                        res.redirect("/login");
                    else {
                    if(result) {
                        req.login(data.rows[0], (err) => {
                            if (err)
                                res.redirect("/login");
                            res.redirect("/secrets");
                        });
                    } else 
                        res.redirect("/login");
                    }
                });
            }else
                res.redirect("/login");
        })
        .catch( err => {
            res.redirect("/login");
        });
}

const userStrategy = async (email, password, done) => {
    try {
        const results = await User.findByEmail(email);

        if(!results.rows[0])
            return done(null, false, {message: "Incorrect Email"});

        const correctPassword = bcrypt.compareSync(password, results.rows[0].password);

        if(!correctPassword)
            return done(null, false, {message: "Incorrect password"});

        return done(null, results.rows[0]);
    } catch(err) {
        return done(err);
    }
};

const serializeUser = (user, done) => {
    done(null, user.id);
};

const deserializeUser = async (id, done) => {
    try {
        const results = await User.findById(id);

        if(!results.rows[0])
            return done(new Error('User not found'));

        done(null, results.rows[0]);
    } catch(err) {
        done(err);
    }
};

const getSecrets = (req, res) => {
    if(req.isAuthenticated())  
        res.render("secrets");
    else
        res.redirect("/login");
}

const getLogout = (req, res) => {
    req.logout(function (err) {
        res.redirect("/");
    });
}

module.exports = {
    getHome,
    getRegister,
    getLogin,
    getLogout,
    getSecrets,
    addUser,
    verifyUser,
    userStrategy,
    serializeUser,
    deserializeUser
}