const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      isUnique: true,
    },
    members: [
      {
        username: String,
        id: String,
      },
    ],
  },
  { timestamps: true }
)

const RoomModel = mongoose.model("Room", RoomSchema)

module.exports = RoomModel
