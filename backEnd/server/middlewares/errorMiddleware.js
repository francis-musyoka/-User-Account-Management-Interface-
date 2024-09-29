const ErrorResponse = require('../utils/error')

// ERROR HANDLER
const errorHandler = (err,req,res,next)=>{
    console.log(err)
    // Handle Mongoose duplicate key error
    if(err.code === 11000){
        const keyName = Object.keys(err.keyValue)[0];
        const value = Object.values(err.keyValue)[0];
        const message =`${keyName} ${value} already exist.`

        err = new ErrorResponse(message,400)
    }
     // Handle Mongoose validation errors
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(value => value.message);
        err = new ErrorResponse(message,400)
    }
    
    if(err.name === "CastError"){
        const message = "Resource not found or invalid identifier provided"
        err = new ErrorResponse(message,400)
    }

        res.status(err.statusCode || 500).json({
        succuss: false,
        error: err.message ||'Internal Server Error'
    })
    
    
}

module.exports = errorHandler;