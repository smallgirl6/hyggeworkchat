//設定Mongoose
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userpic: { type: String, required: true }
});

const ChatRoomSchema = new mongoose.Schema({
    email: { type: String, ref: 'User' },
    roomid: { type: String, required: true },
    roomName: { type: String, required: true },
    lastcreatedAt: { type: Date, default: Date.now },
    // users: [{ type: String, ref: 'User' }]
});
const MessageSchema = new mongoose.Schema({
    roomid: { type: String, ref: 'ChatRoom' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    email: { type: String, ref: 'User' },
    name: { type: String, ref: 'User' },
    userpic: { type: String, ref: 'User' }
});

const User = mongoose.model('User', UserSchema);
const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = { User, ChatRoom, Message};