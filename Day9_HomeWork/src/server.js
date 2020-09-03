const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const MessageModel = require('./routes/messages/schema');
const {
  getUsers,
  setUsername,
  removeUser,
} = require('./routes/users/utilities');

const server = express();
const httpServer = http.createServer(server);

const io = socketio(httpServer);

io.on('connection', (socket) => {
  socket.on('setUsername', async ({ username }) => {
    const users = await setUsername(username, socket.id);
    const usernames = users.map((user) => user.username);

    io.emit('online', usernames);
  });

  socket.on('sendMessage', async (message) => {
    const onlineUsers = await getUsers();

    const newMessage = new MessageModel(message);
    const saveMessage = await newMessage.save();

    const socketId = onlineUsers.find(
      (user) => user.username === saveMessage.to
    );
    io.to(socketId.socketId).emit('message', {
      from: saveMessage.from,
      to: saveMessage.to,
      text: saveMessage.text,
    });
  });

  socket.on('disconnect', async () => {
    await removeUser(socket.id);
  });
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
