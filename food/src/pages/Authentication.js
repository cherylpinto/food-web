import React,{useState} from 'react'
import { Modal } from '@mui/material'
import styles from"./Authentication.module.css"
import Logo from "../utils/images/Logo.png"
import Image from"../utils/images/AuthImage.jpg"
import { Close } from '@mui/icons-material'
import SignIn from"../components/SignIn"
import SignUp from"../components/Signup"


const Authentication = ({openAuth,setOpenAuth}) => {
  const[login,setLogin]=useState(true);
  return (
    <Modal open={openAuth} onClose={()=>setOpenAuth(false)}>
      <div className={styles.authContainer}>
        <div className={styles.left}>
          <img src={Logo} className={styles.logo} alt="Logo"></img>
          <img src={Image} className={styles.auth_img} alt="auth-image"></img>
        </div>
        <div className={styles.right}>
           <div className={styles.closeButton}>
             <Close onClick={()=>setOpenAuth(false)}></Close>
           </div>
           {login?(<>
           <SignIn setOpenAuth={setOpenAuth}/>
           <div className={styles.text}>
              Don't have an account?
              <div onClick={()=>setLogin(false)} className={styles.textButton}>
                SignUp
              </div>
           </div>
           </>):(<>
           <SignUp setOpenAuth={setOpenAuth}/>
           <div className={styles.text}>
             Already have an account?
              <div onClick={()=>setLogin(true)} className={styles.textButton}>
                SignIn
              </div>
           </div>
           </>)}
        </div> 
      </div>
    </Modal>
   )
}

export default Authentication
