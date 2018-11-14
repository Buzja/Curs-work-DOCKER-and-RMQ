const jwt = require('jsonwebtoken');
const {accessSecret, refreshSecret, expiresIn} = require("../../../config");

const generateToken = async(...params) => {
    try{
        const signedData = await jwt.sign(...params);
        return signedData;
    }
    catch(err){
        err.status = 400;
        err.message = "Can't generate token";
        throw err;
    }
}

const decodeToken = async(token,key)=>{
    try{
        const decodedData = await jwt.verify(token,key);
        return decodedData;
    }
    catch(err){
        err.status = 401;
        err.message = "Uncorrect token";
        throw err;
    }
}

const generateAccessToken = async(data) =>{
    try{
        const accessToken = await generateToken(data,accessSecret,{expiresIn});
        return accessToken;
    }
    catch(err){
        throw err;
    }
}

const generateRefreshToken = async(data) =>{
    try{
        const refreshToken = await generateToken(data,refreshSecret);
        return refreshToken;
    }
    catch(err){
        throw err;
    }
}

const decodeAccessToken = async(data)=>{
    try{
        const decodeData = await decodeToken(data,accessSecret);
        return decodeData;
    }
    catch(err){
        throw err;
    }
}

const decodeRefreshToken = async(data)=>{
    try{
        const decodeData = await decodeToken(data,refreshSecret);
        return decodeData;
    }
    catch(err){
        throw err;
    }
}

module.exports = {generateAccessToken,generateRefreshToken,decodeAccessToken,decodeRefreshToken,expiresIn};