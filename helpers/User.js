'use strict';

module.exports = function () {
    return {                              //here we will check all the validations
        SignUpValidation: (req, res, next) => {
            // req.checkBody('username', 'Username is Required').notEmpty();
            // req.checkBody('username', 'Username Must Not be less than 5').isLength({ min: 5 });
            // req.checkBody('email', 'Email is Invalid').isEmail();
            // req.checkBody('password', 'Password is Required').notEmpty();
            // req.checkBody('password', 'Password Must Not be less than 5').isLength({ min: 5 });

            // req.getValidationResult() //This will return promise
            //     .then((result) => {
            //         const errors = result.array(); //Here we need only the error message
            //         const messages = [];  //creating another error
            //         errors.forEach((error) => { //looping through the array
            //             messages.push(error.msg);   //pushing it into the new array
            //         });

            //         req.flash('error', messages); //displaying the error message as flash message.
            //         req.redirect('/signup'); //redirecting to the signup page.
            //     })
            //     .catch((err) =>{
            //         return next();
            //     });  //adding to the User.js folder in the controller
        },


        LoginValidation: (req, res, next) => {
            
            // req.checkBody('email', 'Email is Invalid').isEmail();
            // req.checkBody('password', 'Password is Required').notEmpty();
            // req.checkBody('password', 'Password Must Not be less than 5').isLength({ min: 5 });

            // req.getValidationResult() //This will return promise
            //     .then((result) => {
            //         const errors = result.array(); //Here we need only the error message
            //         const messages = [];  //creating another error
            //         errors.forEach((error) => { //looping through the array
            //             messages.push(error.msg);   //pushing it into the new array
            //         });

            //         req.flash('error', messages); //displaying the error message as flash message.
            //         req.redirect('/'); //redirecting to the same page.
            //     })
            //     .catch((err) =>{
            //         return next();
            //     });  //adding to the User.js folder in the controller
        }
    }
}