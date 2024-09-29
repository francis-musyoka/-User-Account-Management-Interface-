const  mongoose  = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;

//TRIM WHITE SPACES
mongoose.SchemaTypes.String.set('trim', true)

//CREATE SCHEMA
const userSchema = new Schema({
    userName:{
        type: String,
        unique: true,
        required: [true, "Please add UserName"]
    },
    fullName:{
        type: String,
        required: [true, "Please add FullName"]
    },
    email:{
        type: String,
        required: [true, "Please add a E-mail"],
        match: [/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/ , 'Please add a valid E-mail'],
        unique: true

    },
    password:{
        type: String,
        required: [true, "Please add a Password"],
    },
    refreshToken:{
        type: String,
        default: null
    },
    role:{
        type: String,
        default: "User"
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{timestamps: true})




// HASH PASSWORD B4 SAVING
userSchema.pre("save", async function (next){
    if(!this.isModified('password')) return next() 
        const hashedPassword =await bcrypt.hash(this.password,10);
        this.password = hashedPassword;
});


  
// COMPARE PASSWORD B4 WHEN LOGING
userSchema.methods.compareHashedPassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}


// METHOD TO GENERATE ACCESS TOKEN
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({id:this._id},process.env.ACCESS_TOKEN_SECRET,{
         expiresIn: '5m'
    })
}

// METHOD TO GENERATE REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: '7d'
   })
}


const User = mongoose.model("USER",userSchema);
module.exports = User;
