const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId

const tokenSchema = new Schema({
    userId:{
        type: ObjectId,
        ref: 'USER',
        required: true
    },
    accessToken:{
        type: String,
        default: null
    },
    accessTokenExpiration:{ 
        type: Date
    },
    refreshToken:{
        type: String,
        default: null
    },
    refreshTokenExpiration:{ 
        type: Date
    },
},{timestamps:true});


const Token = mongoose.model("TOKEN", tokenSchema);

module.exports =Token