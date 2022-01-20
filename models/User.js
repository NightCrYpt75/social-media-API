const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
   
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    token: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
