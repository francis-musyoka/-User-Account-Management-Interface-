// import {  client } from "../constants";


// // Function to check if a username exists
// export const checkUsernameExistence = async (username) => {
//   try {
//     // Make a GET request to fetch the list of users
//     const response = await client.get();
//     const users = response.data;
//     // Check if the username exists in the list of users
//     const usernameExists = users.some(user => user.username === username);
//     return usernameExists;
//   } catch (error) {
//     console.error('Error checking username existence:', error);
//     return false;
//   }
// };

// // Function to check email exists
// export const checkEmailExistence = async (email) => {
//   try {
//     // Make a GET request to fetch the list of users
//     const response = await client.get();
//     const users = response.data;
//     // Check if the email exists 
//     const emailExists = users.some(user => user.email === email);
//     return emailExists;
//   } catch (error) {
//     console.error('Error checking email existence:', error);
//     return false;
//   }
// };

