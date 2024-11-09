  const express=require("express")
  const router=express.Router()
  const upload=require("../config/multer")

   const AdminController=require("../controller/adminController")

   router.post("/logindata",AdminController.loginData)
   router.post('/addEmployeeData/:id',upload.single("Img Upload"), AdminController.postEmployeeData);
   router.get("/employeeFetch/:id",AdminController.getEmployeeData)
   router.delete("/delete/:id",AdminController.handleDelete)
   router.post("/Edit",upload.single("Img Upload"), AdminController.EditData);



   module.exports=router;



   