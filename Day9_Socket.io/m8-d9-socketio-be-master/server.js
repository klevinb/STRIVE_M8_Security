const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const mongoose = require("mongoose")
const {
  addUserToRoom,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users")
const addMessage = require("./utils/messages")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

io.on("connection", (socket) => {
  console.log("New WebSocket connection ", socket.id)

  socket.on("join", async (options) => {
    try {
      const { username, room } = await addUserToRoom({
        id: socket.id,
        ...options,
      })

      socket.join(room)

      const welcomeMessage = {
        sender: "Admin",
        text: `Welcome to ${room} channel`,
        createdAt: new Date(),
      }

      socket.emit("message", welcomeMessage)

      const messageToRoomMembers = {
        sender: "Admin",
        text: `${username} has joined!`,
        createdAt: new Date(),
      }

      socket.broadcast.to(room).emit("message", messageToRoomMembers)

      const roomMembers = await getUsersInRoom(room)
      io.to(room).emit("roomData", {
        room: room,
        users: roomMembers,
      })
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("sendMessage", async ({ message, room }) => {
    try {
      const user = await getUser(room, socket.id)

      const messageContent = {
        sender: user.username,
        text: message,
        createdAt: new Date(),
      }

      const response = await addMessage(
        messageContent.text,
        user.username,
        room
      )
      if (response) {
        io.to(room).emit("message", messageContent)
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("leaveRoom", async ({ room }) => {
    try {
      const user = await removeUser(socket.id, room)
      const message = {
        username: "Admin",
        text: `${user.username} has left!`,
        createdAt: new Date(),
      }

      const roomMembers = await getUsersInRoom(room)
      if (user) {
        io.to(room).emit("message", message)
        io.to(room).emit("roomData", {
          room: room,
          users: roomMembers,
        })
      }
    } catch (error) {
      console.log(error)
    }
  })
})

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))
