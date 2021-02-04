'use strict'   //This is JS Strict mode
//This page will contain all the routes, to different pages.
module.exports = function (_, passport, User,validator) { //passing  _ from server.js to container.js  so that _ = loadash passport also added there
    return {
        SetRouting: function (router) {      //setting up router 
            router.get('/', this.indexPage);    //routing to the index page
            router.get('/signup', this.getSignUp); //routing to signup page
            // router.get('/home', this.homePage); //to go to homr 
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);

            // router.post('/',User.LoginValidation,this.postLogin);
            router.post('/', [
                validator.check('email').not().isEmpty().isEmail().withMessage('Email is invalid'),
                validator.check('password').not().isEmpty().withMessage('Password is required and must be at least 5 characters')
            ], this.postValidation, this.postLogin);

            router.post('/signup',
                [validator.check('username').not().isEmpty().isLength({ min: 5 }).withMessage('Username is required and must be at least 5 characters'),
                validator.check('email').not().isEmpty().isEmail().withMessage('Email is invalid'),
                validator.check('password').not().isEmpty().withMessage('Password is required and must be at least 5 characters')
                ], this.postValidation, this.postSignUp); //creating a post route and passing this method which is defined below
        },

        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),

        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true 
        }),

        getGoogleLogin: passport.authenticate('google', {
            // scope: ['profile','email']
            scope: ['profile','email']
        }),
        

        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

    
        indexPage: function (req, res) {
            const errors = req.flash('error');
            
            return res.render('index', { title: 'FootBallkk | Login', messages: errors, hasErrors: errors.length > 0 });
        },
        getSignUp: function (req, res) {
            const errors = req.flash('error');
            
            return res.render('signup', { title: 'FootBallkk | SignUp', messages: errors, hasErrors: errors.length > 0 });
        },
        postValidation: function (req, res, next) {

            const err = validator.validationResult(req, res);
            const reqErrors = err.array(); //Here we need only the error message
            const errors = reqErrors.filter(e => e.msg !== 'Invalid value');console.log(errors);
            const messages = [];  //creating another error
            errors.forEach((error) => { //looping through the array
                messages.push(error.msg);   //pushing it into the new array
             
            });
            if(messages.length>0){
                req.flash('error', messages);
                if(req.url === '/signup'){
                    res.redirect('/signup');
                }
                else if(req.url === '/'){
                    res.redirect('/');
                }
            }
            return next();

        },
        //postSignUp takes method passport.authenticate and local.signup is a midway where signup is an html file 
        postSignUp: passport.authenticate('local.signup', {  //checks/authenticates the user
            successRedirect: '/home', //if success moves the user to the home page
            failureRedirect: '/signup',//or else it reverts back to the sign up page.
            failureFlash: true
        }),
        postLogin: passport.authenticate('local.login', {  //checks/authenticates the user
            successRedirect: '/home', //if success moves the user to the home page
            failureRedirect: '/',//or else it reverts back to the sign up page.
            failureFlash: true
        }),

       
    }
}