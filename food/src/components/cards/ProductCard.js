import styles from "./ProductCard.module.css"
import {Rating,CircularProgress} from "@mui/material"
import React,{useState,useEffect} from 'react'
import { FavoriteRounded, ShoppingBagOutlined,FavoriteBorder} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import {
    addToFavourite,
    deleteFromFavourite,
    getFavourite,
    addToCart,
  } from "../../api";
  import { useDispatch } from "react-redux";
  import { openSnackbar } from "../../redux/reducers/SnackBarSlice";
  
  


const ProductCard = ({product}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [favorite, setFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const addFavourite = async () => {
        setFavoriteLoading(true);
        const token = localStorage.getItem("foodeli-app-token");
        await addToFavourite(token, { productId: product?._id })
          .then((res) => {
            setFavorite(true);
            console.log("Added to favorites:", favorite);
            setFavoriteLoading(false);
          })
          .catch((err) => {
            setFavoriteLoading(false);
            console.log(err);
            dispatch(
              openSnackbar({
                message: err.response.data.message,
                severity: "error",
              })
            );
          });
      };
    
      const removeFavourite = async () => {
        setFavoriteLoading(true);
        const token = localStorage.getItem("foodeli-app-token");
        await deleteFromFavourite(token, { productId: product?._id })
          .then((res) => {
            setFavorite(false);
            console.log("Removed from favorites:", favorite);
            setFavoriteLoading(false);
          })
          .catch((err) => {
            setFavoriteLoading(false);
            dispatch(
              openSnackbar({
                message: err.response.data.message,
                severity: "error",
              })
            );
          });
      };
    
      const addCart = async (id) => {
        const token = localStorage.getItem("foodeli-app-token");
        await addToCart(token, { productId: id, quantity: 1 })
          .then((res) => {
            navigate("/cart");
          })
          .catch((err) => {
            dispatch(
              openSnackbar({
                message: err.response.data.message,
                severity: "error",
              })
            );
          });
      };
      const checkFavorite = async () => {
        setFavoriteLoading(true);
        const token = localStorage.getItem("foodeli-app-token");
        await getFavourite(token, { productId: product?._id })
          .then((res) => {
            const isFavorite = res.data?.some(
              (favorite) => favorite._id === product?._id
            );
    
            setFavorite(isFavorite);
    
            setFavoriteLoading(false);
          })
          .catch((err) => {
            setFavoriteLoading(false);
            dispatch(
              openSnackbar({
                message: err.response.data.message,
                severity: "error",
              })
            );
          });
      };
    
      useEffect(() => {
        checkFavorite();
      }, [favorite]);
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <img className={styles.img} src={product?.img} ></img>
        <div className={styles.menu} >
            <div  className={styles.menuItems} onClick={() => { console.log("Heart clicked. Current state:", favorite);(favorite ? removeFavourite() : addFavourite())}}>
            {favoriteLoading ? (
              <>
                <CircularProgress className={styles.FavoriteBorder} />
              </>
            ) : (
              <>
                {favorite ? (
                <FavoriteRounded className={styles.FavoriteRounded}/>
            ) : (
                <FavoriteBorder className={styles.FavoriteBorder} />
              )}
               </>
            )}
            </div>
            <div  className={styles.menuItems} onClick={() => addCart(product?._id)}>
                <ShoppingBagOutlined className={styles.ShoppingBagOutlined}/>
            </div>
        </div>
        <div className={styles.rate}> 
            <Rating value={3.5} className={styles.rating}/>
        </div>
      </div>
      <div className={styles.details} onClick={() => navigate(`/dishes/${product._id}`)}>
        <div className={styles.title}>{product?.name}</div>
        <div className={styles.descp}>{product?.desc}</div>
        <div className={styles.price}>${product?.price?.org}
            <span className={styles.span}>${product?.price?.mrp}</span>
            <div className={styles.percent}>({product?.price?.off}%OFF)</div>
            </div>
      </div>
    </div>
  )
}

export default ProductCard
