const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  projects: [{}],
  role: {
    type: String,
    enum: ["admin", "user"],
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
  const find = await UserModel.findOne({ username });
  if (find) {
    const checkPass = await bcrypt.compare(password, find.password);
    if (checkPass) return find;
    else return null;
  } else {
    return null;
  }
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
