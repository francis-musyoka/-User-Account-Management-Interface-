
import { useNavigate } from "react-router-dom";
import { PATHS_URL} from "../constants";
import axios from 'axios';
import { toast } from "react-toastify";


export const validateUserForm = (userName,fullName,email,password,confirmPassword,hiddenElement=[]) => {
    const errors = {};
   
  
    if (!hiddenElement.includes('username') && !userName.trim()) {
      errors.userName = 'Username is required';
    }
    if (!hiddenElement.includes('fullname') && !fullName.trim()) {
        errors.fullName = 'Fullname is required';
    }
    if (!hiddenElement.includes('email') && !email.trim()) {
      errors.email = 'Email is required';
    } else if(!isValidEmail(email)){
      errors.email = 'Enter valid Email'
    }
    if (!hiddenElement.includes('password') && !password.trim()) {
      errors.password = 'Password is required';
    } else if(!hiddenElement.includes('password') && password.length < 6){
      errors.password = 'Password Should have more than 6 characters'
    }
    if (!hiddenElement.includes('password') && password !== confirmPassword){
        errors.confirmPassword ='Password do not match '
    }
  
    return errors;
  };

  const isValidEmail = (email) => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  

export const sendDataToserver = async(formData)=>{ 
  const navigate =useNavigate()
    try {
      const response =await axios.post('/api/signup',formData)
      console.log(response);
      if(response.data.success === true){
        navigate(PATHS_URL.SIGNIN)
        toast.success('Successfully sign up')
      }
      
    } catch (error) {
      toast.error(error.response.data.error)
      
    }
}
  



// custom hook - to read
// uuid generator v4
// Dry - Do not repeat yourself


// login
// on login  save user on store
// username on local storage
// on reload get username from localstorage, get user from db, save user to context

//  logout 
// clear context and localstorage
// redirect to login


// logged in links
// router guard
// on reload get username from localstorage, get user from db, save user to context

