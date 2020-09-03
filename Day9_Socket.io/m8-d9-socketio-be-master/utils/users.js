const RoomModel = require("../services/rooms/schema")

const addUserToRoom = async ({ id, username, room }) => {
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    }
  }

  try {
    const user = await RoomModel.findOne({
      name: room,
      "members.username": username,
    })
    if (user) {
      await RoomModel.findOneAndUpdate(
        { name: room, "members.username": username },
        { "members.$.id": id }
      )
    } else {
      const user = await RoomModel.findOneAndUpdate(
        { name: room },
        {
          $addToSet: { members: { username, id } },
        }
      )
    }
    return { username, room }
  } catch (error) {
    console.log(error)
    return error
  }
}

const removeUser = async (id, room) => {
  try {
    const foundRoom = await RoomModel.findOne({ name: room })

    const username = foundRoom.members.find((member) => member.id === id)

    await RoomModel.findOneAndUpdate(
      { name: room },
      {
        $pull: { members: { id: id } },
      }
    )

    return username
  } catch (error) {
    console.log(error)
  }
}

const getUser = async (roomName, id) => {
  try {
    const room = await RoomModel.findOne({ name: roomName })
    const user = room.members.find((member) => member.id === id)

    return user
  } catch (error) {
    console.log(error)
  }
}

const getUsersInRoom = async (roomName) => {
  const room = await RoomModel.findOne({ name: roomName })
  return room.members
}

module.exports = {
  addUserToRoom,
  removeUser,
  getUser,
  getUsersInRoom,
}
