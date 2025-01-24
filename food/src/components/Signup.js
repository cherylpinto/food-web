import React,{useState} from 'react'
import styles from "./SignIn.module.css"
import TextInput from './TextInput'
import Button from './Button'
import { useDispatch } from "react-redux";
import { UserSignUp } from "../api";
import { loginSuccess } from "../redux/reducers/UserSlice";
import { openSnackbar } from "../redux/reducers/SnackBarSlice";

const Signup = ({setOpenAuth}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const validateInputs = () => {
        if (!email || !password) {
          alert("Please fill in all fields");
          return false;
        }
        return true;
      };
      const handleSignIn = async () => {
        console.log("SignIn button clicked");   
        setLoading(true);
        setButtonDisabled(true);
        if (validateInputs()) {
          await UserSignUp({ name,email, password })
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
            <div className={styles.title}>Create a New account</div>
            <span>Please enter details to create new account</span>
        </div>
        <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}> 
            <TextInput label="Full Name" placeholder={"Enter your Full Name"} handelChange={(e)=>setName(e.target.value)}></TextInput>
            <TextInput label="Email Address" placeholder={"Enter your Email"} handelChange={(e)=>setEmail(e.target.value)}></TextInput>
            <TextInput label="Password" placeholder={"Enter your Password"} handelChange={(e)=>setPassword(e.target.value)}></TextInput>
            <Button text="Sign Up" onClick={handleSignIn}
            isLoading={loading}
            isDisabled={buttonDisabled}></Button>
        </div>
    </div>
  )
}

export default Signup
