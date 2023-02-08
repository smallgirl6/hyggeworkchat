const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ChatRoom, Message } = require('../../modules/mongodb');
require('dotenv').config();

router.get("/api/historymessageAPI", async (req, res) => {
  let token = req.headers.authorization;
  if (!token) {
      return res.status(401).send({
          message: 'Unauthorized'
      });
  }
  try {
    // 取得 currentRoom
    const currentRoom = req.headers.currentroom;
    
    // 取得所有歷史訊息，並過濾 roomid 相同的訊息
    const chatrooms = await Message.find({ roomid: currentRoom }).sort({ createdAt: 1 });
    
    // 回傳歷史訊息
    res.json({ chatrooms });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
