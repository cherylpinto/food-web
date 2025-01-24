
import{BrowserRouter,Routes,Route} from "react-router-dom"
import Navbar from "./components/Navbar";
import { lightTheme } from "./utils/Theme";
import Home from "./pages/Home";
import { ThemeProvider } from "styled-components";
import Authentication from "./pages/Authentication";
import { useState} from "react";
import Favourites from "./pages/Favourites";
import Cart from "./pages/Cart"
import FoodDetails from "./pages/FoodDetails"
import FoodListing from "./pages/FoodListing"
import { useSelector } from "react-redux";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const[openAuth,setOpenAuth]=useState(false);
  return (
   <>
   <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <div className="app-container">
          <Navbar setOpenAuth={setOpenAuth} openAuth={openAuth} currentUser={currentUser}/>
          <Routes>
            <Route path="/" exact element={<Home/>}/>
            <Route path="/favorite" exact element={<Favourites/>}/>
            <Route path="/cart" exact element={<Cart/>}/>
            <Route path="/dishes/:id" exact element={<FoodDetails/>}/>
            <Route path="/dishes" exact element={<FoodListing/>}/>
            <Route path="/signup" element={<Signup />} /> 
            <Route path="/signin" element={<SignIn />} />
          </Routes>
          {openAuth &&(<Authentication setOpenAuth={setOpenAuth} openAuth={openAuth}/>)}
        </div>
      </BrowserRouter>
   </ThemeProvider>
   </>
  );
}

export default App;
