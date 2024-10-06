
const User = require('../models/userModel');
const ErrorResponse = require('../utils/error')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt =require('bcryptjs')
const { validatePassword } = require('../utils/verifyUser');
const UserTokenController = require('./tokenController')
const Token = require('../models/userTokenModel');


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
            return next(new ErrorResponse('Invalid credentials',404));
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
       const {accessToken,refreshToken} = await UserTokenController.createOrUpdateToken(user._id)
       console.log(accessToken,refreshToken);
       

        // Set options for cookies
        const options = {
            httpOnly: process.env.COOKIE_HTTP_ONLY,
            secure: process.env.COOKIE_SECURE,
            sameSite: process.env.COOKIE_SAME_SITE,
        };
    
        // Set cookies with the generated tokens
        res.status(200)
           .cookie('accessToken', accessToken, options)
           .cookie('refreshToken', refreshToken, options)
           .json({ success: true, accessToken,refreshToken});
        
    } catch (error) {
        next(new ErrorResponse("Can not log in, check your credentials",401));
    }
}


exports.refreshAccessToken =async(req,res,next)=>{
    //Get  tokens from cookies
    const {accessToken,refreshToken} = req.cookies;

    try {
        // Generate new access token
        const {newAccessToken} = await UserTokenController.generateNewAccessToken(accessToken,refreshToken,next);
        
        const options = {
            httpOnly: process.env.COOKIE_HTTP_ONLY,
            secure: process.env.COOKIE_SECURE,
            sameSite: process.env.COOKIE_SAME_SITE,
            
        }

        res.status(200)
            .cookie("accessToken",newAccessToken,options)
            .json({
                success: true,
                newAccessToken
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
    const {accessToken,refreshToken} = req.cookies;

    if (!accessToken || !refreshToken) {
        return res.status(400).json( {message: "Unauthorized: Both access and refresh tokens are required" });
    }

    const userToken = await Token.findOne({refreshToken:refreshToken})
        
    if(!userToken){
        return next(new ErrorResponse("Invalid refresh token provided",404));
    }

    // Check if the access token matches the one stored in the database
    if(userToken.accessToken !== accessToken){
    }

    // Decode the incoming refresh token 
    const decodedToken = jwt.decode(refreshToken);

    if(decodedToken.id !== userToken.userId.toString()){
        return next(new ErrorResponse("User ID mismatch",403));
    }    
      
    await userToken.deleteOne()
        // Set options for cookies
        const options = {
          httpOnly: process.env.COOKIE_HTTP_ONLY,
          secure: process.env.COOKIE_SECURE, 
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
    // console.log(email);
    
    try {
        
        if(!email){
            return next(new ErrorResponse('Please enter email address.',400))
        }
        //Get user from db 
        const user =await User.findOne({email});

        if(!user) {return next(new ErrorResponse('No account found for this email address.',404))}
        
        if(!user.isActive){
            return next(new ErrorResponse('Sorry,Your account is deactivated. Please activate your account.',404))
        }

        //Generate Token
        const secretKey = process.env.FORGOT_PASSWORD_TOKEN_SECRET

        const forgotPasswordToken = jwt.sign({id:user._id},secretKey,{expiresIn:"15m"});

        // Initialize Expiring Time
        const forgotPasswordTokenExpiration = new Date(Date.now() + 1000 * Number(process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN));

        console.log("expering time::",forgotPasswordTokenExpiration.toLocaleString());

        // Save Token and its expiration to db
        user.forgotPasswordTokenExpiration = forgotPasswordTokenExpiration;
        user.forgotPasswordToken = forgotPasswordToken;
        await user.save();

        //Create reset password link
        const link = `http://localhost:3000/reset-password/${forgotPasswordToken}`
 
        //SENT EMAIL
        const transporter = nodemailer.createTransport({
            service: 'gmail',       
            auth: {
              user: process.env.E_MAIL,
              pass: process.env.PASSWORDAPP 
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
              console.log("........???", error);
              return next(new ErrorResponse('Sorry, Error occured when sent email',500))
            } else {
              console.log('Email sent: ' + info.response);
              res.status(201).json({
                success: true, 
            })
            }
          });
 
    } catch (error) {
        next(error)
    }
}


//RESET PASSWORD
exports.resetPassword =async(req,res,next)=>{
    const{token} = req.params;
    const {password,confirmPassword} = req.body;

    try {
         // Find user associated with token 
         const user = await User.findOne({forgotPasswordToken:token});
         console.log(user)
         if(!user){
             return next(new ErrorResponse('User not found',400));
         }

         // Check if the token has expired
         if (user.forgotPasswordTokenExpiration < Date.now()) {
             return next(new ErrorResponse("Token has expired.", 403));
         }
        // Verify token
        const decodedToken = jwt.verify(token, process.env.FORGOT_PASSWORD_TOKEN_SECRET);
        
       // 
       if(user._id.toString() !== decodedToken.id){
        return next(new ErrorResponse("User ID mismatch",403));
        };

        // Set Forgot Password Token and its expiration time to null in the database
        user.forgotPasswordTokenExpiration = undefined;
        user.forgotPasswordToken = undefined
        await user.save()

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
            return next(new ErrorResponse("Link has expired. Please request a new password reset link.",403))
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