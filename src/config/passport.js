const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const db = require('../app/models/userSchema');
const helpers = require('../lib/helpers')

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const user = await db.findOne({ username: username })
  if (user) {
    const validPassword = await helpers.matchPassword(password, user.password);
    if (validPassword) {
      done(null, user, /*req.flash('success', 'Bienvenido ' + user.username)*/ console.log('Bienvenido ' + user.username))
    } else {
      done(null, false, /*req.flash('message', 'Contraseña incorrecta!')*/console.log('Contraseña incorrecta!'))
    }
  } else {
    done(null, false, /*req.flash('message', 'El usuario no existe!')*/console.log('El usuario no existe!'))
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  try {
    const password2 = await helpers.encryptPassword(password)
    const user = await db.findOne({ username: username })
    if (!user) {
      const newUser = new db({
        username: username,
        password: password2,
        img: "https://i.ibb.co/6vRGQPf/usuario.png"
      });
      await newUser.save();
      const data = await db.findOne({ username: username, password: password2 });
      return done(null, data);
    } else {
      done(null, false, /*req.flash('message', 'El nombre ya está en uso!')*/console.log('El nombre ya está en uso!'))
    }
  } catch (e) {
    console.log('[PASSPORT] Passport error ', e)
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.findById(id, function(err, user) {
    done(err, user);
  });
});