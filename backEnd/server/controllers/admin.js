const User = require('../models/userModel');
const ErrorResponse = require('../utils/error')


// GET ALL USERS
exports.getAllUsers = async(req,res,next)=>{
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        next(error)
    }
}

exports.editUserDetails = async(req,res,next)=>{
    try {
        const userId = req.params.id
        const {userName,fullName,email,role} = req.body
        console.log(userName);
        console.log(fullName);
        console.log(email);
        console.log(role);
        
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
            {userName,fullName, email,role},
            {new:true, runValidators: true}
        )
        res.status(200).json({
            success:true
        })
        
    } catch (error) {
        next(error)
    }
};

//ACTIVATE USER
exports.activateUser = async(req,res,next)=>{
    const userId = req.params.id
    try {
       const filter = {_id:userId};
       const user = await User.findOne(filter)
        
       if(!user){
            return(next(new ErrorResponse("User Not Found",404)))
       }
       
       if(user.isActive){
            return(next(new ErrorResponse("User Status Is Active",409)))
       }
        user.isActive = true
        await user.save({validateBeforeSave:false})
            
        res.status(200).json({
            success:true,
            message:"Account was activated successfully"
            })
        
    } catch (error) {
       next(error)
    }
}

//DEACTIVATE USER
exports.deactivateUser = async(req,res,next)=>{
    const userId = req.params.id
    try {
       const filter = {_id:userId};
       const user = await User.findOne(filter)

       console.log(user);
       
        
       if(!user){
            return(next(new ErrorResponse("User Not Found",404)))
       }
       
        // Status code 409 conflict: if the request conflicts with the current state of the resource
        if(!user.isActive){
            return(next(new ErrorResponse("Account is already deactivated",409)))
        }

        user.isActive = false
        await user.save({validateBeforeSave:false}, {new:true})
            
        res.status(200).json({
            success:true,
            message:`User Account ${user.userName} was deactivated successfully`,
            })
        
    } catch (error) {
       next(error)
    }
}

//DELETE USER
exports.deleteUser =async(req,res,next)=>{
    const userId = req.params.id
    try {
        const user = await User.findOne({_id:userId})

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
          }

        await user.deleteOne()

        res.status(204).json({
            success:true,
            message:`User ${user.userName} was deleted successfully`
        })
    } catch (error) {
        next(error)
    }
}


