const {decodeAccessToken} = require("../api/auth/controllers/generateToken");

const authorizationChecker = async(ctx,next)=>{
    try{
        if(ctx.request.url.includes("/auth")){
            await next();
        }else{
            if(ctx.request.header && ctx.request.header.authorization && ctx.request.header.authorization.split(' ')[0] === 'Bearer'){
                const accessToken = ctx.request.header.authorization.split(' ')[1];
                await decodeAccessToken(accessToken);
                await next();
            }
            else{
                const err = new Error();
                err.status = 401;
                err.message = "Unathorized user";
                throw err;
            }
        }        
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

module.exports = authorizationChecker;
