const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const MessageModel = require('./routes/messages/schema');

const server = express();
const httpServer = http.createServer(server);

const io = socketio(httpServer);

var onlineUsers = [];

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('setUsername', (username) => {
    onlineUsers.push({ ...username, id: socket.id });

    const usernames = onlineUsers.map((user) => user.username);

    io.emit('online', usernames);
  });

  socket.on('sendMessage', async (message) => {
    const newMessage = new MessageModel(message);
    const saveMessage = await newMessage.save();

    const socketId = onlineUsers.find(
      (user) => user.username === saveMessage.to
    );

    io.to(socketId.id).emit('message', {
      from: saveMessage.from,
      to: saveMessage.to,
      text: saveMessage.text,
    });
  });

  //   socket.on('reportUser', (user) => {
  //     onlineUsers.filter((user) => user.username !== user.name);
  //   });
});

const port = process.env.PORT;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dn7fa.mongodb.net/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    httpServer.listen(port, () => {
      console.log(`Server running port { ${port} }`);
    })
  )
  .catch((err) => console.log(err));
