const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Promise = require("bluebird");
const SALT = 10;
const _bcrypt = Promise.promisifyAll(bcrypt);

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isConfirmed: {type: String}
});

userSchema.pre("save", async function(next){
    if(this.isModified('password')){
        const salt = await _bcrypt.genSaltAsync(SALT);
        const hash = await _bcrypt.hashAsync(this.password,salt);
        this.password = hash;
        this.isConfirmed = false;
    } 
    next();
})

userSchema.methods.comparePasswords = async function(receivedPassword){
    return _bcrypt.compareAsync(receivedPassword,this.password);
}

module.exports = mongoose.model("User", userSchema);