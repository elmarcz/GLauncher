module.exports = async (port) => {
    const express = require('express');
    const morgan = require('morgan');
    const exphbs = require('express-handlebars');
    const path = require('path');
    const flash = require('connect-flash');
    const session = require('express-session');
    const passport = require('passport');
    const passportLib = require('./config/passport')
    const secure = require('ssl-express-www');

    // Initializations
    const app = express();

    require('dotenv').config()
    require('./config/db')
    require('./config/passport');
    const functions = require('./app/functions/req')


    // Settings
    app.set('port', process.env.PORT || port || 4000);
    app.set('views', path.join(__dirname, 'views'))
    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs',
        helpers: require('./lib/hbs')
    }));
    app.set('view engine', '.hbs')

    // Middlewares
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }))
    app.use(flash())
    app.use(morgan('dev'));
    app.use(secure);
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(passport.initialize());
    app.use(passport.session());

    // Global Variables
    app.use(async (req, res, next) => {
        app.locals.success = req.flash('success');
        app.locals.message = req.flash('message');
        app.locals.user = req.user;
        next();
    })

    // Routes
    require('./app/routes/router')(app, passportLib)

    // Public
    app.use(express.static(path.join(__dirname, 'public')))

    // Start the server
    app.listen(app.get('port'), () => {
        console.log(`[SERVER] Server on port ${app.get('port')}`);
    })

    app.use(function (req, res, next) {
        res.status(404).redirect('/');
    });
}