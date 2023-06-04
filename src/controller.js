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
    findByGoogleId: async (googleId) => {
        const results = await pool.query(queries.verifyGoogleId, [googleId]);
        return results;
    },
    createUser: async (email, password) => {
        const hash = await bcrypt.hash(password, saltRounds);
        const results = await pool.query(queries.addUser, [email, hash]);
        return results;
    },
    addByGoogleId: async (email, id) => {
        const results = await pool.query(queries.addByGoogleId, [email, id]);
        return results;
    },
    addSecret: async (id, secret) => {
        const { rows } = await pool.query(queries.addSecret, [secret, id]);
        return rows[0];
    },
    getSecrets: async () => {
        const { rows } = await pool.query(queries.getSecrets);
        return rows;
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

const localStrategy = async (email, password, done) => {
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

const googleStrategy = async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log(profile);
        console.log(accessToken);
        console.log(refreshToken);

        const results = await User.findByGoogleId(profile.id);

        if(results.rows[0])
            return cb(null, results.rows[0]);
       
        const { rows } = await User.addByGoogleId(profile._json.email, profile.id);
        return cb(null, rows[0]);
    
    } catch(err) {
        return cb(err);
    }
}

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
    const result = User.getSecrets();

    result
        .then(secrets => {
            res.render("secrets", { secrets: secrets });
        })
        .catch(err => {
            res.redirect("/submit");
        });
    
}

const getSubmit = (req, res) => {
    if (req.isAuthenticated())
        res.render("submit");
    else
        res.redirect("/login");
};

const getLogout = (req, res) => {
    req.logout(function (err) {
        res.redirect("/");
    });
}

const addSecret = (req, res) => {
    const secret = req.body.secret;

    const result = User.addSecret(req.user.id, secret);

    result
        .then(user => {
            res.redirect("/secrets");
        })
        .catch(err => {
            res.redirect("/login");
        });
}

module.exports = {
    getHome,
    getRegister,
    getLogin,
    getLogout,
    getSecrets,
    getSubmit,
    addUser,
    addSecret,
    verifyUser,
    localStrategy,
    googleStrategy,
    serializeUser,
    deserializeUser
}