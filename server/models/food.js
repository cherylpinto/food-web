const mongoose=require("mongoose");
const foodSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        default:null,
    },
    price:{
        type:{
            org:{type:Number,default:0.0},
            mrp:{type:Number,default:0.0},
            off:{type:Number,default:0.},
            
        },
        default:{org:0.0, mrp:0.0, off:0.0}
    },
    category:{
        type:[String],
        default:[],
    },
    ingredients:{
        type:[String],
        required:true
    }
},{timestamps:true});

const Food=mongoose.model("food",foodSchema);
module.exports=Food;