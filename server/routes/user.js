const express=require("express")
const { userRegister,userLogin, addToCart,getAllCartItems,removeFromCart,addToFavorites,getUserFavorites,removeFromFavorites,placeOrder,getAllOrders } = require("../controllers/user");
const { verifyToken } = require("../middlewares/verifyUser");
const router=express.Router();

router.post("/signup",userRegister)
router.post("/signin",userLogin)
//router.post("/signin",userRegister)
router.post("/cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getAllCartItems);
router.patch("/cart", verifyToken, removeFromCart);

router.post("/favorite", verifyToken, addToFavorites);
router.get("/favorite", verifyToken, getUserFavorites);
router.patch("/favorite", verifyToken, removeFromFavorites);

router.post("/order", verifyToken, placeOrder);
router.get("/order", verifyToken, getAllOrders);

module.exports=router;