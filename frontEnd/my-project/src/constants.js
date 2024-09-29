// links
import axios from "axios";

const PATHS_URL={
    HOME: "/",
    ABOUT: "/about",
    SIGNIN: "/signin",
    SIGNUP: "/signup",
    PROFILE: "/profile",
    RESETPASSWORD: "/reset-password/:token", 
    FORGOTPASSWORD: "/forgotpassword",
    UPDATEUSERDETAILS: "/updateuserdetails",
    CHANGEPASSWORD: "/changepassword",
    DASHBOARD: "/dashboard"
}


// apiRoutes.js
const POST_ROUTES = {
    SIGN_UP: '/signup',
    SIGN_IN: '/signIn',
    FORGOT_PASSWORD: '/forgotpassword',
    RESET_PASSWORD:(token) => `/reset-password/${token}`,
    REFRESH_ACCESS_TOKEN: "/refreshaccesstoken",
    DEACTIVATE_ACCOUNT: "/deactivate-account",
    ACTIVATE_USER:(id)=> `/activate-user/${id}`,
    DEACTIVATE_USER:(id)=> `/deactivate-user/${id}`,
    DELETE_USER:(id)=> `/delete-user/${id}`,
  };
  
  const GET_ROUTES = {
    GET_SINGLE_USER: (id) => `/getsingleuser/${id}`,
    USER_PROFILE: '/userprofile',
    LOGOUT: `/logout`,
    GET_ALL_USERS: '/get-all-users'
  };
  
  const PUT_ROUTES = {
    UPDATE_USER: (id) => `/updateuser/${id}`,
    UPDATE_USER_PASSWORD: (id) => `/updateuserpassword/${id}`,
    EDIT_USER_DETAILS:(id)=> `/edit-user-details/${id}`,
  };
  
  
  
 const API_HOST = "http://localhost:3800"

 // Axios instance
 const axiosInstance = axios.create({
  baseURL: API_HOST,
  withCredentials: true 
});

 

export {PATHS_URL, POST_ROUTES, GET_ROUTES, PUT_ROUTES ,API_HOST, axiosInstance};

