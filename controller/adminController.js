const Admin = require("../model/admin");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cloudinary=require("../config/cloudinarey")
const Employee=require("../model/employee")





// const loginData = async (req, res) => {
//   const { userName, password } = req.body;

//   try {

//     const existingAdmin = await Admin.findOne({ userName });
//     console.log("existingAdmin ",existingAdmin )
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     // const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password,10);

//     const newAdmin = new Admin({
//       userName,
//       password: hashedPassword,
//     });

//     await newAdmin.save();
//     res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
//   } catch (error) {
//     console.error("Error creating admin:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const loginData = async (req, res) => {
  const { userName, password } = req.body;

  console.log(userName);

  try {
    const existingAdmin = await Admin.findOne({ userName });

    if (!existingAdmin) {
      return res.status(400).json({ message: "invalid user" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }


          


    console.log("sucees login");

    return res
      .status(200)
      .json({ message: "Login successful", admin: existingAdmin });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }

 
};

// const postEmployeeData=async(req,res)=>{

//      console.log(req.params)
//   console.log("Employee Data:", req.body); 
//   console.log("Uploaded File:", req.file);

      

// }

const postEmployeeData = async (req, res) => {
  const { id: AdminID } = req.params;

  const { Name, Email, MobileNo, Designation, Gender, Course } = req.body;


  console.log("mob",MobileNo)
  // Basic manual validation
  if (!Name || Name.length < 2 || Name.length > 50) {
    return res.status(400).json({ message: "Invalid Name" });
  }
  if (!Email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(Email)) {
    return res.status(400).json({ message: "Invalid Email" });
  }
  // if () {
  //   return res.status(400).json({ message: "Invalid Mobile Number" });
  // }
  if (!Designation) {
    return res.status(400).json({ message: "Designation is required" });
  }
  if (!Gender || !["M", "F", "Other"].includes(Gender)) {
    return res.status(400).json({ message: "Invalid Gender" });
  }
  if (!Course) {
    return res.status(400).json({ message: "Course is required" });
  }

  try {
    // Check if AdminID exists
    const adminExists = await Admin.findById(AdminID);
    if (!adminExists) {
      return res.status(400).json({ message: "Invalid Admin ID" });
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ Email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists" });
    }

   
    let imagePath;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "employee_images", 
      });
      imagePath = result.secure_url; 
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    // Create new employee
    const newEmployee = new Employee({
      AdminID,
      Name,
      Email,
      MobileNo,
      Designation,
      Gender,
      Course,
      ImagePath: imagePath,
    });

    await newEmployee.save();

    return res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (error) {
    console.error("Error adding employee data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const getEmployeeData=async(req,res)=>{
      
     

       const {id}=req.params

          const excict=await Employee.find({AdminID:id})
   

         if(!excict){
          return res.status(400).json({message:"invalid admin"})
         }

            return res.status(200).json(excict)

}


const handleDelete = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Employee ID to delete:", id);

 
    const existingEmployee = await Employee.findOneAndDelete({ _id: id });

    if (existingEmployee) {
      console.log('employee edited')
      res.status(204).json({ message: "Employee deleted successfully!" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Error deleting employee" });
  }
};

const EditData = async (req, res) => {
  try {
    const { _id: employeeId, Name, Email, MobileNo, Designation, Gender, Course } = req.body; // Get data from the request body

  
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

  
    const existingEmployee = await Employee.findById(employeeId);
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

   
    let imageUrl = existingEmployee.ImagePath; 
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "employee_images", 
      });
      imageUrl = result.secure_url; 
    }

    
    existingEmployee.Name = Name || existingEmployee.Name;
    existingEmployee.Email = Email || existingEmployee.Email;
    existingEmployee.MobileNo = MobileNo || existingEmployee.MobileNo;
    existingEmployee.Designation = Designation || existingEmployee.Designation;
    existingEmployee.Gender = Gender || existingEmployee.Gender;
    existingEmployee.Course = Course || existingEmployee.Course;
    existingEmployee.ImagePath = imageUrl; 

   
    await existingEmployee.save();

    return res.status(200).json({ message: "Employee updated successfully", employee: existingEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  loginData,
  postEmployeeData,
  getEmployeeData,
  handleDelete,
  EditData
};
