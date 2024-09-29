// import {client } from "../constants";

// export const validateLoginForm = (username, password) => {
//     const error = {};
//     if (!username.trim()) {
//       error.username = 'Username is required';
//     }
//     if (!password.trim()) {
//       error.password = 'Password is required';
//     }
//     return error;
//   };

  
//   export const validateResetPasswordForm = ( NewPassword, confirmPassword) => {
//     const error = {};
//     if (!NewPassword.trim()) {
//       error.NewPassword = 'Password is required';
//     } else if(NewPassword.length<6){
//       error.NewPassword = 'Password should have more 6 characters'
//     }
//     if (confirmPassword !== NewPassword) {
//       error.confirmPassword = 'Passwords do not match';
//     }
//     return error;
//   };

//   export const validateChangePasswordForm = ( currentPassword,newPassword, reEnterNewPassword) => {
//     const error = {};
//     if (!currentPassword.trim()) {
//       error.currentPassword = 'Enter current Password';
//     } 
//     if (!newPassword.trim()) {
//       error.newPassword = 'Password is required';
//     } else if(newPassword.length<6){
//       error.newPassword = 'Password should have more 6 characters'
//     }
//     if (reEnterNewPassword !== newPassword) {
//       error.reEnterNewPassword = 'Passwords do not match';
//     }
//     return error;
//   };

//   // Function to check login credentials
// export const checkLoginCredentials = async (username, password) => {
//     try {
//       //  fetch the list of users
//       const userDetails = await fetchUserData(username); 
//       if (userDetails) {
//         // const isMatch = await bcrypt.compare(password, user.password);
//         // return isMatch;
//         return userDetails.password === password;
//       } else {
//         // Username not found
//         return false;
//       }
//     } catch (error) {
//       console.error('Error checking login credentials:', error);
//       return false;
//     }
//   };



//  export const fetchUserData = async (username) => {
//   try {
//     const response = await client.get(`?username=${username}`);
//     const userData =response.data[0]
//     return userData; // username is unique, so we take the first user from the response
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     return null;
//   }
// };

