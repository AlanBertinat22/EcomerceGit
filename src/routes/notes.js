const router = require('express').Router();

router.get('/notes/add', (req, res) => {
    res.render('notes/new-note');
});

// Creo una direccion de internet exclusivamente para recibir los datos del formulario
router.post('/notes/new-note', (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'por favor ingrese un titulo' });
    }
    if (!description) {
        errors.push({ text: 'por favor ingrese la descripción' });
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });

    } else {
        res.send('ok');
    }
});

router.get('/notes', (req, res) => {
    res.send('Notas desde la DB');
});

module.exports = router;