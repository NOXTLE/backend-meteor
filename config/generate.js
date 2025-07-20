const jwt = require("jsonwebtoken");

// This function generates a JWT token for a user based on their ID
// The token is signed with a secret key and has an expiration time of 30 days
const generate = (id) => {
  console.log(process.env.PORT);
  return jwt.sign({ id }, "ADITYA", { expiresIn: "30d" });
};

module.exports = generate;
