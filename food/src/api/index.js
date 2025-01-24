import axios from "axios";
const API=axios.create({
    baseURL:"http://localhost:8003/api",
})

export const UserSignUp = async (data) => await API.post("/users/signup", data);
export const UserSignIn = async (data) => await API.post("/users/signin", data);

export const getAllProducts = async (filter) =>await API.get(`/food?${filter}`, filter);
export const getProductDetails = async (id) => await API.get(`/food/${id}`);

export const getCart = async (token) =>await API.get(`/users/cart`, {headers: { Authorization: `Bearer ${token}` },});
export const addToCart = async (token, data) => await API.post(`/users/cart/`, data, {headers: { Authorization: `Bearer ${token}` },});
export const deleteFromCart = async (token, data) =>await API.patch(`/users/cart/`, data, {headers: { Authorization: `Bearer ${token}` },});
  
export const getFavourite = async (token) =>await API.get(`/users/favorite`, { headers: { Authorization: `Bearer ${token}` },});
export const addToFavourite = async (token, data) =>await API.post(`/users/favorite/`, data, {headers: { Authorization: `Bearer ${token}` },}); 
export const deleteFromFavourite = async (token, data) =>await API.patch(`/users/favorite/`, data, {headers: { Authorization: `Bearer ${token}` },});
  
  //Orders
export const placeOrder = async (token, data) =>await API.post(`/users/order/`, data, {headers: { Authorization: `Bearer ${token}` },});
export const getOrders = async (token) =>await API.get(`/users/order/`, {headers: { Authorization: `Bearer ${token}` },});