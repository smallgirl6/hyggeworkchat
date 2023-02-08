// //  socket.io connection
// const io = require("socket.io");

// module.exports = (server) => {
//     const socketServer = io(server);
//     socketServer.on("connection", (socket) => {
//         console.log("User connected");
//         socket.on("chat message", (msg) => {
//             console.log("Message: " + msg);
//             socketServer.emit("chat message", msg);
//         });
//     });
// };

const { User, ChatRoom, Message } = require('./mongodb');
const io = require("socket.io");
module.exports = (server) => {
    // 所有登入者的的紀錄maill和socket.id存入onlineclient
    const onlineclients = new Map()
    const socketServer = io(server);
    socketServer.on("connection", (socket) => {
        console.log('A client connected:', socket.id);
        let myIdentifier;
         // 建立一個物件來存放每個客戶端的 identifier 和 socket ID
         socket.on("setIdentifier", (identifier) => {
             console.log("Client connected with identifier: ", identifier);``
             myIdentifier = socket.id;
             onlineclients.set(identifier, myIdentifier);
             console.log("All socket : ", [...onlineclients]);
         });
         
         // 建立room並且發訊息給好友
        socket.on("create room", (roomname,email,name,pic) => {
            // 查看好友是不是在線上
            let friendIdentifier ;
            for (const [clientIdentifier,socketId] of [...onlineclients]) {
                console.log("onlineclients: ", [...onlineclients])
                console.log("clientIdentifier: "+ clientIdentifier)
                console.log("socketId: "+ socketId)
                if (clientIdentifier=== roomname) {
                    friendIdentifier = socketId;
                    break;
                }
            }
            if (!friendIdentifier) {
                console.log("Friend not found: " + roomname);
                return;
            }
            // 建立room
            const roomName = `room-${new Date().getTime()}-${roomname}`;
            console.log(`Creating room: ${roomName}`);
            // 傳給好友roomName
            socket.to(friendIdentifier).emit("room created to user", roomName,email,name,pic);
            // 傳給自己roomName
            socket.emit("room created to me", roomName);
            // 追蹤是否發送了 room-created 事件。
            console.log(`Room created notification sent to ${friendIdentifier}`);   
        });
         // 加入房間
        socket.on("join room", (roomName) => {
            // socket.to(roomName).emit("chat message", msg);
            socket.join(roomName);
            console.log("Enter room: " + roomName);
        });
        
         // 把房間號碼發訊息給好友讓好友加入以創好的房間
         socket.on("add to current room", (roomName,useremail,email,name,pic) => {
            // 查看好友是不是在線上
            let friendIdentifier ;
            for (const [clientIdentifier,socketId] of [...onlineclients]) {
                console.log("onlineclients: ", [...onlineclients])
                console.log("clientIdentifier: "+ clientIdentifier)
                console.log("socketId: "+ socketId)
                if (clientIdentifier=== useremail) {
                    friendIdentifier = socketId;
                    break;
                }
            }
            if (!friendIdentifier) {
                console.log("Friend not found: " + useremail);
                return;
            }
            // 傳給好友roomName
            socket.to(friendIdentifier).emit("room created to user", roomName,email,name,pic);
            // 追蹤是否發送了 room-created 事件。
            console.log(`Room created notification sent to ${friendIdentifier}`);
            
        })

        //在${roomName}發送訊息。
        socket.on("chat message", (msg, name, pic, email, roomName) => {
            console.log("Message: " + msg + " Room: " + roomName);
            socket.to(roomName).emit("chat message user", msg, name, email, pic, roomName);
            socket.emit("chat message me", msg, name, email, pic, roomName);
        });

        //把訊息保存到資料庫
        socket.on("save message", async (myemail, roomid, roomName, message, time, email, name, userpic ) => {
            console.log(myemail, roomid, roomName, message, time, email, name, userpic );
            const ChatRoomSchema = new ChatRoom({ 
                email: myemail,
                roomid: roomid, 
                roomName: roomName, 
                lastcreatedAt: Date.now(),
            });
        
            await ChatRoomSchema.save();
            console.log("Message inserted into the ChatRoomSchema");

            const MessageSchema = new Message({ 
                roomid: roomid,  
                text: message, 
                createdAt:  time ,
                email: email, 
                name: name, 
                userpic: userpic  
            });
        
            await MessageSchema.save(); 
            console.log("Message inserted into the MessageSchema");
        });
    });
};
