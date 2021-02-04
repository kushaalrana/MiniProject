const mongoose = require('mongoose'); //requring mongoose
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({     //defining the Schema for our mongoose DB
        username: {type:String, unique:true,default: ''},
        fullname: {type:String, unique:true,default: ''},
        email: {type:String,unique:true},
        password: {type:String,default: ''},  //if user is logging with fb or gmail then we don't require password so we leave empty 
        userImage: {type: String, default:'default.png'},
        facebook: {type: String, default: ''},
        fbTokens: Array,
        google:{type: String, default: ''},
        sentRequest: [{
                username: {type: String, default: ''}
        }],
        request: [{
            userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            username: {type: String, default: ''}
        }],
        friendsList: [{
                friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                friendName:  {type: String, default: ''}
        }],
        totalRequest: {type: Number, default: 0}
});

userSchema.methods.encryptPassword = function(password){
        return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null); //this method will encrypt the password,encryption password will be of size 10.
};

userSchema.methods.validUserPassword = function(password){
        return bcrypt.compareSync(password,this.password); //here it will match the 2 passwords and will return valid if they match
}

module.exports = mongoose.model('User', userSchema);   //Inside the passport.js file we can make use of the user.js file as we are exporting it.

