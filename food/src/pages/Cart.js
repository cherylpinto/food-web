import React,{useState,useEffect  } from 'react'
import styles from "./Cart.module.css"
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { DeleteOutline } from "@mui/icons-material";
import { addToCart, deleteFromCart, getCart, placeOrder } from "../api";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/reducers/SnackBarSlice";

const Cart = () => {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });
 
  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.quantity * item?.product?.price?.org,
      0
    );
  };
  const convertAddressToString = (addressObj) => {
    // Convert the address object to a string representation
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      const isDeliveryDetailsFilled =
        deliveryDetails.firstName &&
        deliveryDetails.lastName &&
        deliveryDetails.completeAddress &&
        deliveryDetails.phoneNumber &&
        deliveryDetails.emailAddress;

      if (!isDeliveryDetailsFilled) {
        // Show an error message or handle the situation where delivery details are incomplete
        dispatch(
          openSnackbar({
            message: "Please fill in all required delivery details.",
            severity: "error",
          })
        );
        return;
      }

      const token = localStorage.getItem("foodeli-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      const orderDetails = {
        products,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      };

      await placeOrder(token, orderDetails);
      dispatch(
        openSnackbar({
          message: "Order placed successfully",
          severity: "success",
        })
      );
      setButtonLoad(false);
      // Clear the cart and update the UI
      setReload(!reload);
    } catch (err) {
      dispatch(
        openSnackbar({
          message: "Failed to place order. Please try again.",
          severity: "error",
        })
      );
      setButtonLoad(false);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const token = localStorage.getItem("foodeli-app-token");
      await getCart(token).then((res) => {
        setProducts(res.data);
        setLoading(false);
      });
    };
    getProducts();
  }, [reload]);

  const addCart = async (id) => {
    const token = localStorage.getItem("foodeli-app-token");
    await addToCart(token, { productId: id, quantity: 1 })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };

  const removeCart = async (id, quantity, type) => {
    const token = localStorage.getItem("foodeli-app-token");
    let qnt = quantity > 0 ? 1 : null;
    if (type === "full") qnt = null;
    await deleteFromCart(token, {
      productId: id,
      quantity: qnt,
    })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
  };
  return (
    <div className={styles.container}>
      <section>
        <div className={styles.title}>
          Your Shopping Cart
        </div>
        {loading?(<CircularProgress/>):(
        <>
        {products.length===0?(<> Cart is empty</>):(
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <div className={styles.table}>
              <div className={styles.tableItem}>Product</div>
              <div className={styles.tableItem}>Price</div>
              <div className={styles.tableItem}>Quantity</div>
              <div className={styles.tableItem}>SubTotal</div>
            </div>
            {products.map((item)=>(
            <div className={styles.table}>
            <div className={styles.tableItem}>
              <div className={styles.product}>
                  <img className={styles.img} src={item?.product?.img}></img>
                  <div className={styles.details}>
                    <div className={styles.productTitle}>{item?.product?.name}</div>
                    <div className={styles.productDescp}>{item?.product?.desc}</div>
                  </div>
              </div>
            </div>
              <div className={styles.tableItems}>${item?.product?.price?.org}</div>
              <div className={styles.tableItems}>
                <div className={styles.counter}>
                  <div style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() =>
                              removeCart(item?.product?._id, item?.quantity - 1)
                            }>-</div>{item?.quantity}{" "}<div
                            style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() => addCart(item?.product?._id)}>+</div>
                </div>
              </div>
              <div className={styles.tableItems}>                        
                      {" "}
                        $
                      {(item.quantity * item?.product?.price?.org).toFixed(2)}
                      
              </div>
              <DeleteOutline className={styles.tableDeleteOutline}
                        onClick={() =>
                        removeCart(
                        item?.product?._id,
                        item?.quantity - 1,
                        "full"
                      )
                      }></DeleteOutline>
            </div>
            ))}
          </div>
          <div className={styles.right}>
            <div className={styles.subTotal}>Subtotal:${calculateSubtotal().toFixed(2)}</div>
            <div className={styles.delivery}>Delivery Details
              <div>
                <div style={{display :'flex', gap:'6px'}}>
                  <TextInput small placeholder="First Name"
                  value={deliveryDetails.firstName}
                  handelChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      firstName: e.target.value,
                    })
                  }></TextInput>
                  <TextInput small placeholder="Last Name"
                  value={deliveryDetails.lastName}
                  handelChange={(e) =>
                    setDeliveryDetails({
                      ...deliveryDetails,
                      lastName: e.target.value,
                    })
                  }></TextInput>
                </div>
                <TextInput small placeholder="Email Address"
                value={deliveryDetails.emailAddress}
                handelChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    emailAddress: e.target.value,
                  })
                }></TextInput>
                <TextInput small placeholder="Phone no. +91 XXXXX XXXXX"
                value={deliveryDetails.phoneNumber}
                handelChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    phoneNumber: e.target.value,
                  })
                }></TextInput>
                <TextInput small textArea row="5" placeholder="Complete Address(Address,State,Country,Pincode)"
                value={deliveryDetails.completeAddress}
                handelChange={(e) =>
                  setDeliveryDetails({
                    ...deliveryDetails,
                    completeAddress: e.target.value,
                  })
                }></TextInput>
              
              </div>
            </div>
            <div className={styles.delivery}>Payment Details
              <div>
              <TextInput small placeholder="Card Number"></TextInput>
                <div style={{display :'flex', gap:'6px'}}>
                  <TextInput small placeholder="Expiry Date"></TextInput>
                  <TextInput small placeholder="CVV"></TextInput>
                </div>
                <TextInput small placeholder="Card Holder Name"></TextInput>
              </div>
            </div>
            <Button text="Place Order" small
            onClick={PlaceOrder}
            isLoading={buttonLoad}
            isDisabled={buttonLoad}></Button>
          </div>
        </div>)}
        </>)}
      </section>
    </div>
  )
}

export default Cart
