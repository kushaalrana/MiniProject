const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs'); //This is our templating Engine
const http = require('http');

const cookieParser = require('cookie-parser');
// const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const container = require('./container');  // all this modules will be used only once so we are adding here and not in the container.

const {Users} = require('./helpers/UsersClass');
const multer = require('multer');
const fs = require('fs');
const {Global} = require('./helpers/Global');


container.resolve(function (users, _, admin,home,group,results, privatechat) {     //This will take an anonymo us function

    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.Promise = global.Promise;  //This is required for mongoose to work as it has its own promise to work
    // !To connect with DB this is the command
    mongoose.connect('mongodb://localhost/footballkik', { useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true }); //Added path to our database 
    const app = SetupExpress();   //Configuring the express server  setupExpress is a function


    function SetupExpress() {
        const app = express();   //Creating an instance of Express app
        const server = http.createServer(app); //Creating the Server
        const io = socketIO(server);
        server.listen(3000, function () {    //Server is Listening the port 300
            console.log('Listening on port 3000');
        });

        ConfigureExpress(app);
        require('./socket/groupchat')(io,Users);
        require('./socket/friend')(io);
        require('./socket/globalroom')(io, Global,_);
        require('./socket/privatemessage')(io);
        // Setting up Router
        const router = require('express-promise-router')();  //since we are using promises we need express-promise-router to set up the router.
        users.SetRouting(router);  //SetRouting is a function present in controller folder/ user.js
        //users is a file name called users.js
        admin.SetRouting(router); 
        home.SetRouting(router);
        group.SetRouting(router);
        results.SetRouting(router);
     privatechat.SetRouting(router);
        app.use(router);  //Making use of the router 
    }

    function ConfigureExpress(app) {

        require('./passport/passport-local'); //here we have serialized and deserialized for storing and retreving the user information.
        require('./passport/passport-facebook');
        require('./passport/passport-google');


        app.use(express.static('public'));  //with this express will be able to render all the static files like img css js in public folder
        app.set('view engine', 'ejs');    //This is view engine and here we are using ejs
        app.use(cookieParser()); //This is allow us to use cookies and save cookies in browser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true })); //we want to parse url encoded in body parser.
        //* This app.use is an express mid-way
        


        //  app.use(validator()); //this will validate the data on the server side

        app.use(session({  //this will allows us to store and save sessions
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({ mongooseConnection: mongoose.connection }) //MongoStore will save the data example whenever user will refresh the page the data will not be lost and will be saved in Db.
        }));
        app.use(flash()); //To display the flash message

        app.use(passport.initialize());
        app.use(passport.session()); //add after session or else it will show error

        app.locals._ = _;

    }

});