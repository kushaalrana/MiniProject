'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStratergy = require('passport-local').Strategy; //this will allow us to make use of the passport local stratergy

                            //done is a callback 
passport.serializeUser((user, done) => {  //SerializeUser allows or determines which of the user data will be saved in the session 
    done(null,user.id);     //here user.id will be saved in the session 
});
//Here user will contain its user id password name and everything

passport.deserializeUser((id,done) => { //where as in deserializedUser it uses the user.id to retrieve the data from the database.
    User.findById(id,(err,user) => { //here id is matched for retrieving the user so we are passing id and a callback function.
        done(err,user);   //if id exist then error will be null else it will return the error.
    });
});

passport.use('local.signup', new LocalStratergy({ //passing an object in the localStratergy which contains email  and password
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // here all users data will be passed into call back

},(req,email,password,done) => { //a callback function
    User.findOne({'email': email},(err,user) => {
        if(err){        
            return done(err);
        }
        if(user){ //checking if email passsword are matching or existing in db
            return done(null,false,req.flash('error', 'User with email already exist'));
        }
        const newUser = new User();
        newUser.username = req.body.username;//getting username from the body/browser
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);// this will save the password in the encrypted format rather than plain text 

        newUser.save((err) => {
            done(null,newUser);
        });
    });                              
} )); 
passport.use('local.login', new LocalStratergy({ //passing an object in the localStratergy which contains email  and password
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // here all users data will be passed into call back

},(req,email,password,done) => { //a callback function

    User.findOne({'email': email},(err,user) => { //checking if email exist in db if exist it will populate the user object
        if(err){        
            return done(err);
        }
        
        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('Email Does Not Exist or Password is Invalid')
            return done(null,false,req.flash("error",messages));
        }

        return done(null,user);
    });                              
})); 