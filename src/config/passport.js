// Passport me da metodos para poder autenticar el usuario
// no tengo que solicitarle los datos tan seguido
const passport = require('passport');

// En este caso voy a usar la autenticación local
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user =  await User.findOne({email: email});
    if(!user){
        return done(null, false, {message:'Usuario no encontrado.'});
    }else {
        const match = await user.matchPassword(password);
        if (match){
            return done(null, user);
        } else {
            return done(null, false, {message:'Contraseña incorrecta.'});
        }
    }
}));

passport.serializeUser((user,done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) => {
        done(err,user);
    });
});

module.exports = passport;