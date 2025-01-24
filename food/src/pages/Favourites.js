import React,{useEffect, useState} from 'react'
import ProductCard from '../components/cards/ProductCard'
import styles from "./Favourites.module.css"
import { getFavourite } from '../api'
import { CircularProgress } from '@mui/material'
const Favourites = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const token = localStorage.getItem("foodeli-app-token");
      await getFavourite(token).then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
    };
    getProducts();
  }, [])
  
  
  return (
    <div className={styles.container}>
      <section>
        <div className={styles.title}>Your Favourites</div>
        <div className={styles.cardWrapper}>
          {loading ? (
            <CircularProgress />
          ) : products.length === 0 ? (
            <div className={styles.noFavorites}>No favourites yet.</div> // Display message if no favorites
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product}></ProductCard>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Favourites
