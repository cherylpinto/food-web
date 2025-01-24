import { CircularProgress, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./FoodDetails.module.css"
import Button from "../components/Button";
import {
  FavoriteBorder,
  FavoriteBorderOutlined,
  FavoriteRounded,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  addToFavourite,
  deleteFromCart,
  deleteFromFavourite,
  getFavourite,
  getProductDetails,
} from "../api";
import { openSnackbar } from "../redux/reducers/SnackBarSlice";
import { useDispatch } from "react-redux";

const FoodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      await getProductDetails(id).then((res) => {
        console.log("Product Details:", res.data);
        setProduct(res.data);
        setLoading(false);
      });
    };
    const checkFavorite = async () => {
      setFavoriteLoading(true);
      const token = localStorage.getItem("foodeli-app-token");
      await getFavourite(token, { productId: id })
        .then((res) => {
          const isFavorite = res.data?.some((favorite) => favorite._id === id);
  
          setFavorite(isFavorite);
  
          setFavoriteLoading(false);
        })
        .catch((err) => {
          setFavoriteLoading(false);
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        });
    };
    
    getProduct();
    checkFavorite();
  }, []);
  const addFavourite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("foodeli-app-token");
    await addToFavourite(token, { productId: id })
      .then((res) => {
        setFavorite(true);
        setFavoriteLoading(false);
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };
  const addCart = async () => {
    setCartLoading(true);
    const token = localStorage.getItem("foodeli-app-token");
    await addToCart(token, { productId: id, quantity: 1 })
      .then((res) => {
        setCartLoading(false);
        navigate("/cart");
      })
      .catch((err) => {
        setCartLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };
  const removeFavourite = async () => {
    setFavoriteLoading(true);
    const token = localStorage.getItem("foodeli-app-token");
    await deleteFromFavourite(token, { productId: id })
      .then((res) => {
        setFavorite(false);
        setFavoriteLoading(false);
      })
      .catch((err) => {
        setFavoriteLoading(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };
  return (
    <div className={styles.container}>
      {loading?(<CircularProgress/>):(
      <div className={styles.wrapper}>
        <div className={styles.imageWrapper}>
          <img src={product?.img} className={styles.img}></img>
        </div>
        <div className={styles.details}>
          <div>
            <div className={styles.title}>{product?.name}</div>
          </div>
            <Rating value={3.5}/>
            <div className={styles.price}>₹{product?.price?.org}<span className={styles.span}>₹{product?.price?.mrp}</span> <div className={styles.percent}>(₹{product?.price?.off}% Off)</div></div>
            <div className={styles.d}>{product?.desc}</div>
            <div className={styles.ingredients}>
              Ingredients
              <div className={styles.items}>
              {product?.ingredients.map((ingredient) => (
                <div className={styles.item}>{ingredient}</div>
              ))}
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <Button text="Add to cart" full outlined isLoading={cartLoading}
                onClick={() => addCart()}></Button>
              <Button text="Order Now" full></Button>
              <Button leftIcon={favorite?<FavoriteRounded className={styles.FavoriteRounded}/>:<FavoriteBorderOutlined className={styles.FavoriteBorderOutlined}/>} full outlined isLoading={favoriteLoading}
                onClick={() => (favorite ? removeFavourite() : addFavourite())}></Button>
            </div>
        </div>
      </div>)}
    </div>
  )
}

export default FoodDetails
