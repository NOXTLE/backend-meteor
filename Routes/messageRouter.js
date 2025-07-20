const express = require("express");
const protect = require("../middleware/authMiddleware");
const { sendMessage, allMessages } = require("../controller/messageController");
const messageRouter = express.Router();

messageRouter.route("/").post(protect, sendMessage);
messageRouter.route("/:chatId").get(protect, allMessages);

module.exports = messageRouter;
