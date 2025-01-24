const jwt=require("jsonwebtoken");
require("dotenv").config();
const {createError}=require("../error");
const bcrypt=require("bcrypt");
const User=require("../models/User");
const Order=require("../models/order");
const e = require("express");
const secret = process.env.JWT || "yesitsme";

async function userRegister(req,res,next){
    try{
        const {email,password,name,img}=req.body;
        console.log('Request Payload:', req.body);
        const existingUser=await User.findOne({email});
        if(existingUser){
            return next(createError(409,"Email already in use"));
        }
        const salt=bcrypt.genSaltSync(10);
        const hashedPassword=bcrypt.hashSync(password,salt);
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            img,
        })
        const token=jwt.sign({id:user._id},secret,{expiresIn:"10y"})
        return res.status(201).json({token,user})
    }
    catch(err){
        next(err);
    }
}
async function userLogin(req,res,next){
    try{
        const {email,password}=req.body;
        const user = await User.findOne({ email});
        if (!user) {
          return next(createError(409, "User not found."));
        }
        const isPasswordCorrect=bcrypt.compareSync(password,user.password);
        if(!isPasswordCorrect){
            return next(createError(403, "Incorrect Password"))
        }
        const token=jwt.sign({id:user._id},secret,{expiresIn:"10y"})
        return res.status(201).json({token,user})
    }
    catch(err){
        next(err);
    }
}
async function addToCart(req,res,next){
    try{
        const { productId, quantity } = req.body;
        const userJWT = req.user;
        console.log(req.user);
        const user = await User.findById(userJWT.id);
        console.log(user); 
        if (!user.cart) {
            user.cart = []; 
          }
        const existingCartItemIndex = user.cart.findIndex((item) =>
          item.product.equals(productId)
        );
        if (existingCartItemIndex !== -1) { 
          user.cart[existingCartItemIndex].quantity += quantity;
        } else {
          user.cart.push({ product: productId, quantity });
        }
        await user.save();
        return res
          .status(200)
          .json({ message: "Product added to cart successfully", user });
       }
    catch(err){
        next(err);
    }
}

async function removeFromCart(req,res,next){
    try{
        const { productId, quantity } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);
        const productIndex = user.cart.findIndex((item) =>
          item.product.equals(productId)
        );
        if (productIndex !== -1) {
          if(quantity&&quantity>0){
          user.cart[productIndex].quantity -= quantity;
          if(user.cart[productIndex].quantity<=0){
                user.cart.splice(productIndex,1);
            }
          }
          else {
            user.cart.splice(productIndex,1);
            }
            await user.save();
            return res
              .status(200)
              .json({ message: "Product added to cart successfully", user });
        } 
        else{
            return next(createError(404, "Product not found in the user's cart"));
        }
       }
    catch(err){
        next(err);
    }
}
async function getAllCartItems(req,res,next){
    try{
        const userJWT = req.user;
        const user=await User.findById(userJWT.id).populate({
            path:"cart.product",
            model:"food",
        });
        const cartItems=user.cart;
        return res.status(200).json(cartItems);
       }
    catch(err){
        next(err);
    }
}
async function placeOrder(req,res,next){
    try{
       const{products,address,totalAmount}=req.body;
       console.log("Received products:", products)
       const userJWT = req.user;
       const user=await User.findById(userJWT.id);
       const order=await Order.create({
        products,
        user:user._id,
        total_amount:totalAmount,
        address,
       })
       user.orders.push(order);
       user.cart = [];
       await user.save();
       return res
      .status(200)
      .json({ message: "Order placed successfully", order });
       }
    catch(err){
        next(err);
    }
}
async function getAllOrders(req,res,next){
    try{
        const userJWT = req.user;
        const user=await User.findById(userJWT.id).populate({path: "orders",
            model: "order", 
            populate: {
                path: "products.product", 
                model: "food", 
            }});
            console.log(user.orders)
        const allOrders=user.orders;
    
       return res
      .status(200)
      .json(allOrders);
       }
    catch(err){
        next(err);
    }
}
async function removeFromFavorites (req, res, next){
    try {
      const { productId } = req.body;
      const userJWT = req.user;
      console.log(userJWT);
      const user = await User.findById(userJWT.id);
      console.log(user);
      user.favourites = user.favourites.filter((fav) =>fav && !fav.equals(productId));
      await user.save();
  
      return res
        .status(200)
        .json({ message: "Product removed from favorites successfully", user });
    } catch (err) {
      next(err);
    }
  };
  async function addToFavorites (req, res, next){
    try {
        const { productId } = req.body;
        const userJWT = req.user;
        const user = await User.findById(userJWT.id);
    
        if (!user.favourites.includes(productId)) {
          user.favourites.push(productId);
          await user.save();
        }
    
        return res
          .status(200)
          .json({ message: "Product added to favorites successfully", user });
    } catch (err) {
      next(err);
    }
  };
  async function getUserFavorites (req, res, next){
    try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites").exec();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const favoriteProducts = user.favourites;
    return res.status(200).json(favoriteProducts);
    } catch (err) {
      next(err);
    }
  };

module.exports={
    userRegister,
    userLogin,
    addToCart,
    removeFromCart,
    getAllCartItems,
    placeOrder,
    getAllOrders,
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
}