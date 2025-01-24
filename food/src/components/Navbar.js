  import React, { useState } from 'react'
  import styles from "./Navbar.module.css"
  import Logo from "../utils/images/Logo.png"
  import{NavLink} from "react-router-dom"
  import { SearchRounded,FavoriteBorder,ShoppingCartOutlined, MenuRounded} from '@mui/icons-material';
  import Button from "./Button";
  import { Avatar } from '@mui/material';
  import {logout} from "../redux/reducers/UserSlice";
  import { useDispatch } from 'react-redux';
  import { useNavigate } from 'react-router-dom'; 

  const Navbar = ({setOpenAuth,openAuth,currentUser}) => {
    const navigate = useNavigate(); 
    const[isOpen,setIsOpen]=useState(false);
    const dispatch = useDispatch();
    console.log("Current User:", currentUser);

    return (
      <div className={styles.nav}>
        <div className={styles.nav_container}>
          <div className={styles.mobileIcon} onClick={()=>setIsOpen(!isOpen)}>
            <MenuRounded className={styles.menuRounded}/>
          </div>
          <NavLink to="/" className={styles.navLogo}>
            <img src={Logo} alt="Logo" className={styles.logo}></img>
          </NavLink>
          <div className={styles.mobileIcons}>
          <NavLink to="/search">
              <SearchRounded className={styles.searchIcon}/>
            </NavLink>
            <NavLink to="/favorite">
              <FavoriteBorder className={styles.favIcon} />
            </NavLink>
            <NavLink to="/cart">
              <ShoppingCartOutlined className={styles.shopIcon} />
            </NavLink>
            {currentUser && (
            <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
          )}
          </div>
          <ul className={styles.navItems}>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/dishes" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                Dishes
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                Contact
              </NavLink>
            </li>
          </ul> 
          <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ""}`}>
            <ul className={styles.mobileNavItems}>
            <li>
              <NavLink to="/" onClick={()=>setIsOpen(false)} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                Home
              </NavLink>  
            </li>
            <li>
              <NavLink to="/dishes" onClick={()=>setIsOpen(false)} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                Dishes
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" onClick={()=>setIsOpen(false)} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={()=>setIsOpen(false)} className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                Contact
              </NavLink>
            </li>
            {currentUser ? (
              <>
                <div className={styles.textButton} onClick={() => dispatch(logout())}>
                  Logout
                </div>
              </>
            ) : (
            <div style={{display:'flex', gap:"12px"}}>
              <Button text="Sign Up" outlined small  onClick={()=>setOpenAuth(true)}  />
              <Button text="Sign In" small onClick={()=>setOpenAuth(true)} />
            </div>
            )}
          </ul> 
            </div>
            <div className={styles.buttonContainer}>
            <NavLink to="/search">
              <SearchRounded className={styles.searchIcon}/>
            </NavLink>
            {currentUser ? (
            <>
            <NavLink to="/favorite">
              <FavoriteBorder className={styles.favIcon} />
            </NavLink>
            <NavLink to="/cart">
              <ShoppingCartOutlined className={styles.shopIcon} />
            </NavLink>
            <Avatar src={currentUser?.img}>{currentUser?.name[0]}</Avatar>
              <div className={styles.textButton} onClick={() => dispatch(logout())}>Logout</div>
            </>):(
            <div style={{display:'flex', gap:"12px"}}>
              <Button text="Sign In" small onClick={()=>setOpenAuth(true)} />
            </div>)}
          </div>
        </div>  
      </div>
    )
  }

  export default Navbar
