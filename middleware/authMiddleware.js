const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //Bearer afnsalfnalf
      // [0]      [1]

      //decode and verify the token

      const decode = jwt.verify(token, "ADITYA");

      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (e) {
      console.log(e);
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("not authorized");
  }
});

module.exports = protect;
