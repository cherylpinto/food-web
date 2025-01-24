const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        default:null,
    },
    favourites:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"food",
        default:[],
    },
    orders:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"order",
        default:[],
    },
    cart: {
        type: [
          {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "food" },
            quantity: { type: Number, default: 1 },
          },
        ],
  
        default: [],
      },
},{timestamps:true});

const User=mongoose.model("user",userSchema);
module.exports=User;