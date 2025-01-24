const express=require("express");
const {addProducts, getFoodItems, getFoodById}=require("../controllers/Food");
const router=express.Router();

router.post("/add",addProducts);
router.get("/",getFoodItems);
router.get("/:id",getFoodById);
module.exports=router;