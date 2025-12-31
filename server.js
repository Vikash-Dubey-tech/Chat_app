require("dotenv").config();

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);
const io = socketio(server);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected...'))
    .catch(err => console.log(err));

// 2. Set static folder for frontend
app.use(express.static('public'));

// 3. Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log('New User Connected');

    // Load old messages from MongoDB and send to the new user
    Message.find().then(result => {
        socket.emit('output-messages', result); // send ol messages to the connected client/user
    }).catch(err => {
      console.log("DATABASE ERROR:", err);
    });

    // Listen for a chat message from a client
    socket.on('chatMessage', (data) => {
        // data contains { username, text }

        // Save to MongoDB
        const message = new Message({ username: data.username, text: data.text });
        message.save().then((savedMessage) => {
            console.log('✅ Message saved to DB:', savedMessage);

            // Broadcast the message to EVERYONE connected (including sender)
            io.emit('message', data);
        }).catch(err => {
            console.log('❌ Database Save Error:', err);
        });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
