const express=require("express");
const mongoose=require("mongoose")
const app=express();
const PORT=process.env.PORT||8003;
require("dotenv").config();
const cors=require("cors");
const userRouter=require("./routes/User");
const foodRouter=require("./routes/Food");

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
      success: false,
      status,
      message,
    });
  });
app.use("/api/users",userRouter);
app.use("/api/food",foodRouter);

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("MongoDB connected")).catch((err)=>console.log("Failed to connect to mongoDB",err));
mongoose.set("strictQuery",true)

app.get("/",async(req,res)=>{
    res.status(200).json({message:"Hello"})
})

app.listen(PORT,()=>console.log("Server Started"))