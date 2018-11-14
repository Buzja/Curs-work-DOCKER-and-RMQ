const User = require("../models/user");
const {generateAccessToken,generateRefreshToken,decodeRefreshToken,expiresIn} = require("./generateToken");

const refreshToken = async(ctx) => {
    try{
        const headerRefreshToken = ctx.request.header.authorization.split(" ")[1];
        const {_id} = await decodeRefreshToken(headerRefreshToken);
        const user = await User.findById(_id);
        
        if(!user){
            const err = new Error();
            err.status = 400;
            err.message = "User not found";
            throw err;
        }
    
        const accessToken = await generateAccessToken({_id: user._id}); // TODO: передаваемые данные в access token
        const refreshToken = await generateRefreshToken({_id: user._id});//TODO: структура refresh token-а
    
        ctx.status = 200;
        ctx.body = {success:true,accessToken,refreshToken,expiresIn};
    }
    catch(err){
        if(err.status !== undefined){
            ctx.status = err.status;
            ctx.body = {success: false, message: err.message};
        }
        else{
            console.log(err);
        }
    }
}

module.exports = refreshToken;