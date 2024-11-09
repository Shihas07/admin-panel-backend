const express = require("express");
const AdminRoutes = require("./routes/adminRoutes");
const cors =require("cors")
const mongoose=require("mongoose")

const app = express();
const port = 5000;


app.use(express.json()); 



app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST',"DELETE"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/", AdminRoutes);


mongoose
.connect("mongodb://localhost:27017/mechineTask", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
