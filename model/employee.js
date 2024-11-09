const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  AdminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  MobileNo: {
    type: String,
   
  },
  Designation: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    enum: ['M', 'F', 'Other'],
    required: true,
  },
  Course: {
    type: String,
    required: true,
  },
  ImagePath: {
    type: String,
    required: true,
  }
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
