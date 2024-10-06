
import { useNavigate } from "react-router-dom";
import { PATHS_URL} from "../constants";
import axios from 'axios';
import { toast } from "react-toastify";
import { isPasswordValid ,isEmailValid} from "./index";


// Sign up form validation
export const validateSignUpForm = (userName,fullName,email,password,confirmPassword,hiddenElement=[]) => {
      const errors = {};
    
      if (!hiddenElement.includes('username') && !userName.trim()) {
        errors.userName = 'Username is required';
      }
      if (!hiddenElement.includes('fullname') && !fullName.trim()) {
          errors.fullName = 'Fullname is required';
      }
      if (!hiddenElement.includes('email') && !email.trim()) {
        errors.email = 'Email is required';
      } else if(!isEmailValid(email)){
        errors.email = 'Enter valid Email'
      }
      if (!hiddenElement.includes('password') && !password.trim()) {
        errors.password = 'Password is required';
      } else if(!hiddenElement.includes('password') && !isPasswordValid(password)){
        errors.password = `Password should at least have 1 number, 1 lowercase letter, 1 uppercase letter, 
                          1 special character, no space, and it must be 6-16 characters long.`
      }
      if (!hiddenElement.includes('password') && password !== confirmPassword){
          errors.confirmPassword ='Password do not match '
      }
    
      return errors;
  };

  // Sign in form validation
  export const validateLoginForm = (userName, password) => {
      const error = {};
      if (!userName.trim()) {
        error.userName = 'Username is required';
      }
      if (!password.trim()) {
        error.password = 'Password is required';
      }
      return error;
  };


  // Change Password form validation
  export const validateChangePasswordForm = ( currentPassword,password, confirmPassword) => {
      const error = {};
      if (!currentPassword.trim()) {
        error.currentPassword = 'Enter current Password';
      } 
      if (!password.trim()) {
        error.password = 'Password is required';
      } else if(!isPasswordValid(password)){
        error.password = `Password should at least have 1 number, 1 lowercase letter, 1 uppercase letter, 
                              1 special character, no space, and it must be 6-16 characters long.`
      }
      if (confirmPassword !== password) {
        error.confirmPassword = 'Passwords do not match';
      }
      return error;
  };

  // Forgot Password form validation
  export const validateForgotPasswordForm = (email,password,confirmPassword)=>{
      const error ={};
      if(!email && !email.trim()){
        error.email ='Please enter email'
      }
      return error
  };

  // Reset Password form validation
  export const validateResetPasswordForm = (password,confirmPassword)=>{
      const error ={};
      if (!password.trim()) {
        error.password = 'Password is required';
      } else if(!isPasswordValid(password)){
        error.password = `Password should at least have 1 number, 1 lowercase letter, 1 uppercase letter, 
                          1 special character, no space, and it must be 6-16 characters long.`
      }
      if (password !== confirmPassword){
          error.confirmPassword ='Password do not match '
      }
      return error
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

