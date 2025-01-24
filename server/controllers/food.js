const Food=require("../models/Food");
const mongoose=require("mongoose");
const {createError}=require("../error");
async function addProducts(req,res,next) {
    try{
        const foodData=req.body;
        if(!Array.isArray(foodData))
        {
            return next(createError(400,"Invalid Request, Expected an array of foods"));
        }
        let createdfoods=[];
        for(const foodInfo of foodData){
            const { name, desc, img, price, ingredients, category } = foodInfo;
            const product = await Food.create({
            name,
            desc,
            img,
            price,
            ingredients,
            category,
            });
            createdfoods.push(product);
        }
        return res.status(201).json({ message: "Products added successfully", createdfoods });
    }catch(err)
    {
        next(err);
    }

}
async function getFoodById(req,res,next) {
    try{
        const{id}=req.params;
        if(!mongoose.isValidObjectId(id)){
            return next(createError(400,"Invalid Product ID"))
        }
        const food=await Food.findById(id);
        if(!food){
            return next(createError(404,"Food not found"))
        }
        return res.status(200).json(food);
    }catch(err)
    {
        next(err);
    }
}
async function getFoodItems(req,res,next) {
    try{
        let { categories, minPrice, maxPrice, ingredients, search } = req.query;
        ingredients = ingredients?.split(",");
        categories = categories?.split(",");
        const filter = {};
        if (categories && Array.isArray(categories)) {
          filter.category = { $in: categories }; 
        }
        if (ingredients && Array.isArray(ingredients)) {
          filter.ingredients = { $in: ingredients }; 
        }
        if (maxPrice || minPrice) {
            filter["price.org"] = {};
            if (minPrice) {
              filter["price.org"]["$gte"] = parseFloat(minPrice);
            }
            if (maxPrice) {
              filter["price.org"]["$lte"] = parseFloat(maxPrice);
            }
          }
          if (search) {
            filter.$or = [
              { title: { $regex: new RegExp(search, "i") } }, 
              { desc: { $regex: new RegExp(search, "i") } }, 
            ];
          }
          const foodList = await Food.find(filter);
      
          return res.status(200).json(foodList);
    }catch(err)
    {
        next(err);
    }
}
module.exports={
    addProducts,
    getFoodItems,
    getFoodById,
}
