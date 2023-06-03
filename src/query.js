const addUser = "INSERT INTO users (email, password) VALUES ($1, $2)";
const verifyUser = "SELECT * FROM users WHERE email = $1 AND password = $2";

module.exports = {
    addUser,
    verifyUser,
}