
const User = require('../models/userModel');
const ErrorResponse = require('../utils/error')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt =require('bcryptjs')
const { validatePassword } = require('../utils/verifyUser');
const {generateAccessAndRefreshTokens} = require("../utils/generateTokens")


//SIGNUP
exports.signUp=async(req,res,next)=>{
    const {userName,fullName,email,password,confirmPassword} =req.body;

    const isUserNameExist = await User.findOne({userName})
    const isEmailExist = await User.findOne({email})

    if(isUserNameExist){
        return next(new ErrorResponse(`UserName ${userName} already exist`,400))
    }
    if(isEmailExist){
        return next(new ErrorResponse(`E-mail ${email} already exist`,400))
    }

    const validation =  await validatePassword(password,confirmPassword);
    if (!validation.success) {
        return next(new ErrorResponse(validation.message,400));
      }

    try {
        const user = await User.create({userName,fullName,email,password})
        res.status(201).json({
            success: true,
            user       
        })
     
    } catch (error) {
       next(error)
    }
    
}


//SIGNIN
exports.signIn= async(req,res,next)=>{
    const{userName,password} =req.body;
        
        // Validate email and password presence
        if(!userName || !password){
            return next(new ErrorResponse('Please enter userName and Password',400));
        };

    try {
        // Find the user by userName in the database
        const user = await User.findOne({userName});
        
        // Check if the user exists
        if(!user){
            return next(new ErrorResponse('Invalid credentials',401));
        }

        if(!user.isActive){
            return next(new ErrorResponse('Your account is deactivated',401));
        }

        // Verify the correctness of the provided password
        const isPasswordValid  = await user.compareHashedPassword(password)

        // Handle incorrect password
        if(!isPasswordValid){
            return next(new ErrorResponse('Invalid credentials2',401));
        };
        
        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Set options for cookies
        const options = {
            httpOnly: true,
            sameSite: 'Lax', 
            secure: false,
        };
    
        // Set cookies with the generated tokens
        res.status(200)
           .cookie('accessToken', accessToken, options)
           .cookie('refreshToken', refreshToken, options)
           .json({ success: true, accessToken});
        
    } catch (error) {
        next(new ErrorResponse("Can not log in, check your credentials",401));
    }
}

exports.refreshAccessToken =async(req,res,next)=>{
    //Get  refresh token from cookies
    const incomingRefreshToken = req.cookies.refreshToken;
      console.log(incomingRefreshToken);

    // If no refresh token is present, deny access with a 401 Unauthorized status
    if(!incomingRefreshToken){
        return next(new ErrorResponse("Refresh token not Provided",401))
    }

    try {

        // Verify the incoming refresh token using the secret key
         const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
            
            
         // Find the user associated with the refresh token
         const user = await User.findById(decodedToken.id);
          

         // If  user not found and stored refresh token doesn't match the incoming one deny access
         if(!user){
            return next(new ErrorResponse("Access denyed",401))
         }

         console.log("refreshToken..........??",user.refreshToken);
         console.log("incomingRefreshToken..........??",incomingRefreshToken);
         
         if(user.refreshToken!== incomingRefreshToken){
            return next(new ErrorResponse("Access denyed222",401))
         }

         // Generate new access
         const accessToken = user.generateAccessToken();

         const options = {
            httpOnly: true,
            sameSite: "Lax",
            secure: false
         }

         res.status(200)
            .cookie("accessToken",accessToken,options)
            .json({
                success: true,
                accessToken
            })

    } catch (error) {
        next(error)
    }  
}




//GET USER BY ID
exports.getSingleUser= async(req,res,next)=>{
  
    try {
        const id = req.params.id
        const user = await User.findById(id)
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        next(error)
    }
}

//GET LOGIN USER DETAILS
exports.userProfile = async(req,res,next)=>{
        res.status(200).json({
            success: true,
            user: req.user
        });
}

//LOGOUT
exports.logout= async(req,res,next)=>{
       let token = req.cookies.accessToken;

       if (!token) {
        return res.status(400).json({ message: "No token provided" });
    }

    console.log("..................token", token);

    // Decode the token without verifying it
    const decodedToken = jwt.decode(token);

    if (!decodedToken || !decodedToken.id) {
        return res.status(400).json({ message: "Invalid token" });
    }
 
        // Remove the refresh token from the user's information
        const user = await User.findById(decodedToken.id)
        
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
      
        // Set options for cookies
        const options = {
          httpOnly: true,
          secure: true, // Enable in a production environment with HTTPS
        };
      
        // Clear the access and refresh tokens in cookies
        return res
                .status(200)
                .cookie("accessToken","", options)
                .cookie("refreshToken","", options)
                .json( {  success: true });
}

// UPDATE USER DETAILS
exports.updateUserDetails = async(req,res,next)=>{
    try {
        const userId = req.params.id
        const {userName,fullName,email} = req.body
        //Check if username and email exist
        const userNameExist = await User.findOne({ userName: userName, _id: { $ne: userId }});
        const emailExist = await User.findOne({email: email, _id:{$ne:userId}});

        if (userNameExist) {
            return next(new ErrorResponse(`Username ${req.body.userName} already exists`, 400 ));
        }
        if (emailExist) {
            return next(new ErrorResponse(`E-mail ${req.body.email} already exists`, 400 ));
          }
        
        await User.findOneAndUpdate(
            {_id:userId}, 
            {userName,fullName, email},
            {new:true, runValidators: true}
        )
        res.status(200).json({
            success:true
        })
        
    } catch (error) {
        next(error)
    }
};


exports.updateUserPassword = async(req,res,next)=>{
    try {
        const userId = req.params.id
        const {currentPassword,password,confirmPassword} = req.body
          
        const user = await User.findById(userId)
        const isPasswordMatching = await user.compareHashedPassword(currentPassword)
        if(!isPasswordMatching){
            return next(new ErrorResponse('The current password is incorrect.',400));
        };

        if(currentPassword === password){
            return next(new ErrorResponse("Password should be different from the current password",400))
        }

        // Validate password
        const validation =await validatePassword(password,confirmPassword)
        if(!validation.success){
            return next(new ErrorResponse(validation.message,400))
        }
        
        const hashedPassword = await bcrypt.hash(password,10)
        
        await User.findOneAndUpdate(
            {_id:userId}, 
            {password:hashedPassword},
            {new:true, runValidators: true}
        )
        res.status(200).json({
            success:true
        })
        
    } catch (error) {
        next(error)
    }
};

//FORGOTPASSWORD
exports.forgotPassword = async(req,res,next)=>{
    const{email}= req.body;
    console.log(email);
    
    try {
        const user =await User.findOne({email});
        if(!user) {return next(new ErrorResponse('No account found for this email address.',404))}
         
        const secretKey = process.env.FORGOT_PASSWORD_TOKEN_SECRET
        const token = jwt.sign({id:user._id},secretKey,{expiresIn:"15m"});

       //CREATE LINK
       console.log("......................");
       
        const link = `http://localhost:3000/reset-password/${token}`
 
        //SENT EMAIL
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'aappp2358@gmail.com',
              pass: 'oxil qzht hxag zmow'
            }
            
          });
          
          const mailOptions = {
            from: process.env.E_MAIL,
            to: user.email,
            subject: 'RESET-PASSWORD',
            text: `
                Hello ${user.userName} click the link below to reset your password
                The link expires in 15 Minutes
                ${link}
                
                If you did not request ignore `

          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        res.status(200).json({
            success: true,
            
        })
    } catch (error) {
        next(error)
    }
}


//RESET PASSWORD
exports.resetPassword =async(req,res,next)=>{
    const{token} = req.params;
    const {password,confirmPassword} = req.body;

    try {
        //Verify token
        const decodedToken = jwt.verify(token, process.env.FORGOT_PASSWORD_TOKEN_SECRET);

        // Validate password and check if passwords match
        const validation = await validatePassword(password,confirmPassword)
        if (!validation.success) {
            return next(new ErrorResponse(validation.message,400));
        };

        //Hash password
        const hashedPassword = await bcrypt.hash(password,10)
        
        await User.findOneAndUpdate({_id:decodedToken.id},{password:hashedPassword})
        res.status(204).json({
            success:true,
        })

    } catch (error) {
        if(error.message ==="jwt expired"){
            return next(new ErrorResponse("Link has expired. Please request a new password reset link.",400))
        }
        next(error) 
    }
}

// DEACTIVATE USER
exports.deactivateAccount = async(req,res,next)=>{
    const user = req.user
     try{
        if(!user){
             return(next(new ErrorResponse("User Not Found",404)))
        }
        
         user.isActive = false
         await user.save({validateBeforeSave:false})
             
         res.status(200).json({
             success:true,
            message: "Account was deactivated successfully"
             })
         
     } catch (error) {
        next(error)
     }
}