const addUser = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
const verifyEmail = "SELECT * FROM users WHERE email = $1";
const verifyId = "SELECT * FROM users WHERE id = $1";

module.exports = {
    addUser,
    verifyEmail,
    verifyId,
}