const router = require('express').Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => { 
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
})

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
})

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    const errors = [];
    if (name.length <= 0 || email.length <= 0 || password.length <= 0 || confirmpassword.length <= 0) {
        errors.push({ text: 'Complete todos los campos' });
    }
    if (password != confirmpassword) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe ser mayor a 4 caracteres.' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirmpassword });
    }
    else {
 
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'Este email ya se encuentra registrado');
            res.redirect('/users/signup');
        } else {
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Usuario registrado con éxito');
            res.redirect('/users/signin');
        }
    }
});

module.exports = router;