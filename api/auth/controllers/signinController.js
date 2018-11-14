const User = require("../models/user");
const {generateAccessToken,generateRefreshToken,expiresIn} = require("./generateToken");

const signinUser = async(ctx) =>{
    try{
        const {email,password} = ctx.request.body;
        const user = await User.findOne({email});

        if(!user){
            const err = new Error();
            err.status = 400;
            err.message = "User not found";
            throw err;
        }
        const isPasswordValid = await user.comparePasswords(password);
    
        if(!isPasswordValid){
            const err = new Error();
            err.status = 400;
            err.message = "Invalid password";
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

module.exports=signinUser;