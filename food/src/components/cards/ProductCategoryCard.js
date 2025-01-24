import React from 'react'
import styles from "./ProductCategoryCard.module.css"


const ProductCategoryCard = ({category}) => {
  return (
    <div className={styles.card}>
        <div className={styles.top}>
            <img src={category.img} className={styles.img}></img>
            <div className={styles.menu}>
                <div className={styles.button}>{category.name}</div>
            </div>
            <div  className={styles.sale}>{category.off}</div>
        </div>
      
    </div>
  )
}

export default ProductCategoryCard
