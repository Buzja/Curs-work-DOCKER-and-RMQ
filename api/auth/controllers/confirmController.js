const User = require("../models/user");
const {decodeRefreshToken} = require("./generateToken");

const confirmEmail = async(ctx) =>{
    try{
        const token = ctx.request.body.token;
        const {email} = await decodeRefreshToken(token);
        const user = await User.findOne({email});

        if(!user){
            const err = new Error();
            err.status = 400;
            err.message = "User not found";
            throw err;
        }
        user.isConfirmed = true;
        await user.save();
        ctx.status = 200;
        ctx.body = {success:true,confirmEmail: true};
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

module.exports = confirmEmail;