const mongoose=require("mongoose");
const ordersSchema=new mongoose.Schema({
    total_amount:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"Payment Done",
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true,
    },
    products:{
        type:[
            {
                product:{type:mongoose.Schema.Types.ObjectId, ref:"food",required:true},
                quantity:{type:Number,default:1},
            },
        ],
        required:true,
    },
},{timestamps:true});

const Order=mongoose.model("order",ordersSchema);
module.exports=Order;