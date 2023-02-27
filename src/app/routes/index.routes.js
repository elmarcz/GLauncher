module.exports = async (app) => {

    const functions = require('../functions/req.js')
    const passport = require('passport');
    const gameSchema = require('../models/gamesSchema')
    const userSchema = require('../models/userSchema')

    app.get('/', (req, res) => {
        if (functions.isLoggedIn) {
            res.render('pages/noLoged')
        } else {
            res.redirect('/games')
        }
    });

    app.get('/login', functions.yaLogeado, (req, res) => {
        res.render('pages/login')
    });

    app.get('/signup', functions.yaLogeado, (req, res) => {
        res.render('pages/signup')
    });

    app.post('/login', functions.yaLogeado, async (req, res) => {
        const { username, password } = req.body
        passport.authenticate('local.signin', {
            successRedirect: '/games',
            failureRedirect: '/err',
            failureFlash: true
        })(req, res, username, password);
    })

    app.post('/signup', functions.yaLogeado, async (req, res) => {
        const { username, password } = req.body
        passport.authenticate('local.signup', {
            successRedirect: '/games',
            failureRedirect: '/err',
            failureFlash: true
        })(req, res, username, password)
    })

    app.get('/games', functions.isLoggedIn, async (req, res) => {
        const games = await gameSchema.find({ username: req.user.username })
        res.render('pages/games', { games: games })
    });

    app.get('/game/:name', functions.isLoggedIn, async (req, res) => {
        const { name } = req.params
        const gameSelected = await gameSchema.findOne({ name: name, username: req.user.username })
        const games = await gameSchema.find({ username: req.user.username })
        if (gameSelected == 0 || gameSelected == null) {
            return res.redirect('/games')
        }
        res.render('pages/game', {
            games: games,
            gameSelected: gameSelected
        })
    });

    app.get('/logout', functions.isLoggedIn, async (req, res) => {
        req.logOut()
        res.redirect('/')
    })

    app.get('/addGame', functions.isLoggedIn, (req, res) => {
        res.render('pages/addGame')
    });

    app.post('/addGame', functions.isLoggedIn, async (req, res) => {
        const { name, url } = req.body
        const game = new gameSchema({
            name: name,
            url: url,
            username: req.user.username,
            hours: 0
        });
        await game.save()
        res.redirect('/games')
    });

    app.get('/img', functions.isLoggedIn, (req, res) => {
        res.render('pages/addGame')
    });

    app.get('/profile', functions.isLoggedIn, (req, res) => {
        res.render('pages/profile')
    });

    app.get('/img', functions.isLoggedIn, (req, res) => {
        res.render('pages/img')
    });
}