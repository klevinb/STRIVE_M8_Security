const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    sender: String,
    room: { type: String, ref: "Room" },
  },
  { timestamps: true }
)

const MessageModel = mongoose.model("Message", MessageSchema)

module.exports = MessageModel
