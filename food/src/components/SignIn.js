import React,{useState} from 'react'
import styles from "./SignIn.module.css"
import TextInput from './TextInput'
import Button from './Button'
import { useDispatch } from "react-redux";
import { UserSignIn } from "../api";
import { loginSuccess } from "../redux/reducers/UserSlice";
import { openSnackbar } from "../redux/reducers/SnackBarSlice";

const SignIn = ({setOpenAuth}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const validateInputs = () => {
        if (!email || !password) {
          alert("Please fill in all fields");
          return false;
        }
        return true;
      };
      const handelSignIn = async () => {
        console.log("SignIn button clicked");   
        setLoading(true);
        setButtonDisabled(true);
        if (validateInputs()) {
          await UserSignIn({ email, password })
            .then((res) => {
              dispatch(loginSuccess(res.data));
              dispatch(
                openSnackbar({
                  message: "Login Successful",
                  severity: "success",
                })
              );
              setLoading(false);
              setButtonDisabled(false);
              setOpenAuth(false);
              
            })
            .catch((err) => {
              setLoading(false);
              setButtonDisabled(false);
              dispatch(
                openSnackbar({
                  message: err.message,
                  severity: "error",
                })
              );
            });
        }
      };

  return (
    <div className={styles.container}>
        <div>
            <div className={styles.title}>Welcome to Foodeli</div>
            <span>Please Login with your details here</span>
        </div>
        <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}> 
            <TextInput label="Email Address" value={email} placeholder={"Enter your Email"} handelChange={(e)=>setEmail(e.target.value)}></TextInput>
            <TextInput label="Password" value={password} password placeholder={"Enter your Password"} handelChange={(e)=>setPassword(e.target.value)}></TextInput>
            <div className={styles.textButton}>Forgot Password?</div>
            <Button text="Sign In"
            onClick={handelSignIn}
            isLoading={loading}
            isDisabled={buttonDisabled}></Button>
        </div>
    </div>
  )
}

export default SignIn
