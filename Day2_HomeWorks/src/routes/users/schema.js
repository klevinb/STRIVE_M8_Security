const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.statics.findByUsernameAndPassword = async (username, password) => {
  let find = await UserModel.findOne({ username });
  if (find) {
    const isMatch = await bcrypt.compare(password, find.password);
    if (isMatch) return find;
    else return null;
  } else return null;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
