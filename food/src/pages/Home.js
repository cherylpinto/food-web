import React, { useEffect, useState } from 'react'
import styles from "./Home.module.css"
import { category } from '../utils/data'
import Image from "../utils/images/Header.png"
import ProductCategoryCard from '../components/cards/ProductCategoryCard'
import ProductCard from '../components/cards/ProductCard'
import { getAllProducts } from '../api'
import { CircularProgress } from '@mui/material'

const Home = () => {
  const [loading,setLoading]=useState(false);
  const[products,setProducts]=useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.imgSection}>
        <img src={Image}></img>
      </section>
      <section>
        <div className={styles.title}>Food Categories</div>
        <div className={styles.cardWrapper}>
          {category.map((category)=>(
            <ProductCategoryCard category={category}></ProductCategoryCard>
          ))}
        </div>
      </section>
      <section>
        <div className={styles.title}>Most Popular</div>
        {loading?(<CircularProgress/>):
        (<div className={styles.cardWrapper}>
          {products.map((product)=>(
            <ProductCard product={product}/>
          ))}
        </div>)}
      </section>
    </div>
  )
}

export default Home
