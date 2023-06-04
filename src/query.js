const addUser = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
const verifyEmail = "SELECT * FROM users WHERE email = $1";
const verifyId = "SELECT * FROM users WHERE id = $1";
const verifyGoogleId = "SELECT * FROM users WHERE googleId = $1";
const addByGoogleId = "INSERT INTO users(email, googleId) VALUES ($1, $2) RETURNING *";

module.exports = {
    addUser,
    verifyEmail,
    verifyId,
    verifyGoogleId,
    addByGoogleId,
}