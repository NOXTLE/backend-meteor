const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generate = require("../config/generate");
const asyncHandler = require("express-async-handler");

// Function to find user and compare password
const findUser = async (user, password) => {
  console.log("User:", user.password, "Password:", password);

  return bcrypt.compare(password, user.password);
};

// Function to register a new user
// It checks if the user already exists, hashes the password, and creates a new user in the database
// If successful, it returns the user details along with a generated token
const register = asyncHandler(async (req, res) => {
  const { name, email, pwd, pic } = req.body;
  console.log(name, email, pwd, pic);

  if (!name || !email || !pwd) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the password using bcrypt
  // The salt rounds are set to 10, which is a good default for security
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(pwd, salt);

  try {
    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generate(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to create user");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Server error");
  }
});

// Function to log in a user
// It checks if the user exists, compares the provided password with the stored hashed password,
const login = asyncHandler(async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }
  const user = await User.findOne({ email });

  const passwordMatch = await findUser(user, pwd);
  if (user && passwordMatch) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generate(user._id),
    });
  }
});

// /user/ GET
const allUser = asyncHandler(async (req, res) => {
  const q = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          // { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const usr = await User.find(q).find({ _id: { $ne: req.user._id } });

  res.send(usr);
});
//regex helps in finding and pattern matching in mongoDB it takes 2 thing $regex: query . $option

module.exports = { register, login, allUser };
