const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  userName: {
    type: String,
  },

  password: {
    type: String,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
