const ErrorResponse = require('../utils/error')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

//AUTHENTICATION 
exports.isAuthenticated = async(req,res,next)=>{
         // Look for the token in cookies
        const token = req.cookies.accessToken;
        
        // If there's no token, deny access with a 401 Unauthorized status
        if (!token){
            return next(new ErrorResponse("You must Log in to access",401));
        }
        try {
             // Check if the token is valid using a secret key
            const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
       
            // Get the user linked to the token
            const user = await User.findById(decodeToken.id).select(
                "-password -refreshToken"
            );

              // If the user isn't found, deny access with a 404 Not Found status
            if (!user) {
                return next(new ErrorResponse("User not found", 404));
            }
        
            req.user = user;
            next()

        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return next(new ErrorResponse("Session has expired. Please log in again.", 401));
              }
            next(error);
        }

}
 

exports.isAdmin = async(req,res,next)=>{
    if(req.user.role !== "Admin"){
        return next(new ErrorResponse("Not authorized to access", 401));
    }
    next()
}