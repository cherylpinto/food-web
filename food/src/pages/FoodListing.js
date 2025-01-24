import React, { useEffect,useState } from 'react'
import styles from "./FoodListing.module.css"
import ProductCard from '../components/cards/ProductCard'
import {filter} from "../utils/data"
import { CircularProgress, Slider } from '@mui/material'
import styled from 'styled-components'
import { getAllProducts } from '../api'

const SelectableItem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({ theme }) => theme.text_secondary+50};
  color: ${({ theme }) => theme.text_secondary+90};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;
  ${({ selected, theme }) =>
    selected &&
    `
  border: 1px solid ${theme.text_primary};
  color: ${theme.text_primary};
  background: ${theme.text_primary + 30};
  font-weight: 500;
  `}
`;

const FoodListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
  const [selectedCategories, setSelectedCategories] = useState([]); // Default selected categories

  useEffect(() => {
    const getFilteredProductsData = async () => {
      setLoading(true);
      // Call the API function for filtered products
      await getAllProducts(
        selectedCategories.length > 0
          ? `minPrice=${priceRange[0]}&maxPrice=${
              priceRange[1]
            }&categories=${selectedCategories.join(",")}`
          : `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
      ).then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
    };
  getFilteredProductsData();
   
  }, [priceRange,selectedCategories])
  
  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.menu}>
          {filter.map((filters)=>(
            <div className={styles.filterSection}>
                <div className={styles.title}>{filters.name}</div>
                {filters.value==="price"?(
                  <Slider
                  aria-label="Price"
                  defaultValue={priceRange}
                  min={0}
                  max={1000}
                  valueLabelDisplay="auto"
                  marks={[
                    { value: 0, label: "$0" },
                    { value: 1000, label: "$1000" }]}
                    onChange={(e, newValue) => setPriceRange(newValue)}/>
                ):filters.value==="category"?(
                  <div className={styles.Item}>
                    {filters.items.map((item)=>(
                      <SelectableItem  selected={selectedCategories.includes(item)}
                      onClick={() =>
                        setSelectedCategories((prevCategories) =>
                          prevCategories.includes(item)
                            ? prevCategories.filter(
                                (category) => category !== item
                              )
                            : [...prevCategories, item]
                        )
                      }>
                          {item}
                      </SelectableItem>
                    ))}
                  </div>
                ):(null)}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.product}>
        <div className={styles.cardWrapper}>
        {loading ? (
            <CircularProgress />
          ) : (
            <>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodListing
