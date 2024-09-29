const User = require('../models/userModel');
//GENARATE TOKEN

generateAccessAndRefreshTokens = async (user) => {
    try {
      // Generate an access token and a refresh token
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      // Save the refresh token to the user in the database
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
   
      // Return the generated tokens
      return { accessToken, refreshToken };
    } catch (error) {
      // Handle any errors that occur during the process
      next(error)
    }
  };


 