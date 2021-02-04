'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy; //this will allow us to make use of the passport local stratergy
const secret = require('../secret/secretFile');
//done is a callback 
passport.serializeUser((user, done) => {  //SerializeUser allows or determines which of the user data will be saved in the session 
    done(null, user.id);     //here user.id will be saved in the session 
});
//Here user will contain its user id password name and everything

passport.deserializeUser((id, done) => { //where as in deserializedUser it uses the user.id to retrieve the data from the database.
    User.findById(id, (err, user) => { //here id is matched for retrieving the user so we are passing id and a callback function.
        done(err, user);   //if id exist then error will be null else it will return the error.
    });
});

passport.use(new FacebookStrategy({ 
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true
}, (req, token, refreshToken, profile, done) => { //a callback function
    User.findOne({ facebook: profile.id }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) { //checking if email passsword are matching or existing in db
            return done(null, user);
        }
        else {
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'https://graph.facebook.com/' + profile.id + '/picture?type = large';
            newUser.fbTokens.push({ token: token });

            newUser.save((err) => {
                return done(null, user);
            })

        }
    })
}));
