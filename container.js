const dependable = require('dependable');  //installing dependable module 
const passport = require('passport');
const path = require('path');         //requiring path so that we can route to any path  this is inbuilt module so no need to install it

const container = dependable.container(); //creating a new container

const simpleDependencies = [      //Adding modules here so that every time we dont need to require them in other files
     ['_', 'lodash'],           // this is an array of key value pair _=val at index [0] and loadash=v[1]; 
     ['mongoose', 'mongoose'],
     ['passport','passport'],
     ['validator','express-validator'],  //all these we are using in users.js
     ['formidable','formidable'],
     ['Club','./models/clubs'],
     ['Users', './models/user'],
     ['Message', './models/message'],
     ['async','async']
];


simpleDependencies.forEach(function(val){    //Since this is array we will iterate through them with forEach loop
    container.register(val[0],function(){      //this register is part of dependable api to register the module and here we are getting value at index 0 
        return require(val[1]);                 //and returning value at index 1
    })
});
container.load(path.join(__dirname, '/controllers')); //we can make use of the functions present in controllers through this
container.load(path.join(__dirname, '/helpers'));     //we can make use of the functions present in helper through this

container.register('container', function(){    //registering the container here so that we will use this container only everytime insted of writing require for each and every dependancies like loadash,async etc.
    return container;                          // returning the container
});

module.exports = container;//Exporting the container here to server.js