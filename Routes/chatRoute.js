const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removefromgroup,
  fetchChats,
} = require("../controller/chatController");
const chatrouter = express.Router();
chatrouter.route("/").post(protect, accessChat);
chatrouter.route("/").get(protect, fetchChats);
chatrouter.route("/group").post(protect, createGroupChat);
chatrouter.route("/rename").put(protect, renameGroup);
chatrouter.route("/groupadd").put(protect, addToGroup);
chatrouter.route("/groupremove").put(protect, removefromgroup);
// chatrouter.route("/groupremove").put(protect, removefromgroup);
// chatrouter.route("/addgroup").put(protect, addTogroup);

module.exports = chatrouter;
