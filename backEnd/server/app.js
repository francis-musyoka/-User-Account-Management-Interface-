const express = require('express');
const  mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors =require('cors')
require('dotenv').config()


const userRouter = require('./routers/userRouters');
const adminRouter = require('./routers/adminRouters')
const errorHandler = require('./middlewares/errorMiddleware')

const app = express();

//MIDDLEWARES
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow credentials (cookies)
}));


app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());


//ROUTERS
app.use(userRouter)
app.use(adminRouter)


// ERROR HANDLING MIDDLEWARE
app.use(errorHandler)


mongoose.connect(process.env.END_POINT_LINK)
.then(result=>{
    console.log("MongoDB connected"); 
}).catch(error=>{
    console.log(error);   
})


app.listen(3800 ,()=>{
    console.log(`Server listening on port ${process.env.PORT}`); 
})