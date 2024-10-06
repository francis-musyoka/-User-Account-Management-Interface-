const Token = require('../models/userTokenModel');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/error')

exports.createOrUpdateToken = async(userId)=>{

    console.log(userId);
    
    //Generate tokens
    const accessToken = jwt.sign({id:userId},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: '2m' || process.env.ACCESS_TOKEN_EXPIRES_IN
    });
    console.log(process.env.ACCESS_TOKEN_EXPIRES_IN);
    
    const refreshToken = jwt.sign({id:userId},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: '4m' || process.env.REFRESH_TOKEN_EXPIRES_IN  
   });

   console.log(accessToken,refreshToken);
   
   
   //Token expiration date
   const accessTokenExpiration = new Date(Date.now()+ 1000 * Number(process.env.ACCESS_TOKEN_EXPIRES_IN));
   const refreshTokenExpiration = new Date(Date.now()+ 1000 * Number(process.env.REFRESH_TOKEN_EXPIRES_IN));

   // find is user exist
   const userToken = await Token.findOne({userId:userId})


   if(userToken){
        userToken.accessToken = accessToken;
        userToken.refreshToken = refreshToken;
        userToken.accessTokenExpiration = accessTokenExpiration;
        userToken.refreshTokenExpiration = refreshTokenExpiration;
        await userToken.save()

        console.log("::::::Updated");
        
   }else{
        const user = await Token.create({userId,accessToken,accessTokenExpiration,refreshToken,refreshTokenExpiration})
        console.log("::::::Saved");
        console.log(user);
        
    }

   return {accessToken,refreshToken}
};


exports.generateNewAccessToken =async(accessToken,refreshToken, next)=>{
    try {        
        // Check if refresh token exists in the database
        const userToken = await Token.findOne({refreshToken:refreshToken})
        
        if(!userToken){
            return next(new ErrorResponse("Invalid refresh token provided",403));
        }

        // Check if the access token matches the one stored in the database
        if(userToken.accessToken !== accessToken){
            return next(new ErrorResponse("Invalid access token provided",403));
        }

        // Check if the refresh token has expired
        if (userToken.refreshTokenExpiration < Date.now()) {
            return next(new ErrorResponse("Refresh token has expired. Please log in again.", 403));
        }
        
        // Verify the incoming refresh token 
        const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        
        
        if(decodedToken.id !== userToken.userId.toString()){
            return next(new ErrorResponse("User ID mismatch",403));
        }
        
        // Generate new access
        const newAccessToken = jwt.sign({id:userToken.userId},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: "2m" || process.env.ACCESS_TOKEN_EXPIRES_IN   
        });

        console.log("NEW:::::????",newAccessToken);

        const accessTokenExpiration = new Date(Date.now()+ 1000 * Number(process.env.ACCESS_TOKEN_EXPIRES_IN));

        // Update access token and its expiration time in the database
        userToken.accessToken = newAccessToken; 
        userToken.accessTokenExpiration = accessTokenExpiration;
        await userToken.save()

        console.log("ACCESS TOKEN UPDATED");
      
        return {newAccessToken}  

    } catch (error) {
        console.error("Error in generating new access token:", error);
        return next(error);
    }
  
}