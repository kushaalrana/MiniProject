'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretFile');

passport.serializeUser((user, done) => {  //SerializeUser allows or determines which of the user data will be saved in the session 
    done(null, user.id);     //here user.id will be saved in the session 
});
//Here user will contain its user id password name and everything

passport.deserializeUser((id, done) => { //where as in deserializedUser it uses the user.id to retrieve the data from the database.
    User.findById(id, (err, user) => { //here id is matched for retrieving the user so we are passing id and a callback function.
        done(err, user);   //if id exist then error will be null else it will return the error.
    });
});

passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => { //a callback function
    User.findOne({ google: profile.id }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            // console.log('new user created:' + user);
            return done(null, user);
        }
        else {
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            
            newUser.username = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.image;

            newUser.save((err) => {
                if (err) { return done(err) }

                return done(null, newUser);
            })
            }

    })
}));
