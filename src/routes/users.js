const router = require('express').Router();

router.get('/users/signin', (req,res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req,res) => {
    res.render('users/signup');
})

router.post('/users/signup', (req,res) => {
    const {name,email,password,confirmpassword} = req.body;
    const errors = [];
    if (name.length <= 0 || email.length <= 0 || password.length <= 0 || confirmpassword.length <= 0  ){
        errors.push({text: 'Complete todos los campos'});
    }
    if (password != confirmpassword) {
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres.'});
    }
    if(errors.length > 0 ){
        res.render('users/signup', {errors, name, email, password, confirmpassword});
    }
    else{
        res.send('ok');
    }
    console.log(errors);
    console.log(req.body);
});

module.exports = router;