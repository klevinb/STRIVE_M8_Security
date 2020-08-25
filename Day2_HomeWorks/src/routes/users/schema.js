const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const { hashPass, hashCompare } = require("../utilities");

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

UserSchema.statics.findByUsernameAndPassword = async (email, password) => {
  const find = await UserModel.findOne({ email });
  if (find) {
    const sameCred = await hashCompare(password);
    if (sameCred) return find;
    else return null;
  }
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await hashPass(user.password);
  }
  next();
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
