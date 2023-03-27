const mongoose = require("mongoose");
const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
});

const userslogin = new mongoose.model("userslogin", loginSchema);

module.exports = userslogin;
