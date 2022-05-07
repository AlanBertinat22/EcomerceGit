const router = require('express').Router();

const { request } = require('express');


// obtengo la ruta donde definí el schema para la base de datos.
// Al crear un schema, es como crear una clase, la misma se tendrá que instanciar
// para luego poder ser utilizada para insertar, modificar o borrar.
const Note = require('../models/Note');
const { isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

// Creo una direccion de internet exclusivamente para recibir los datos del formulario
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
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
        const newNote = new Note({ title, description });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota agregada exitosamente.');
        res.redirect('/notes')
    }
});

// Una vez que guardo un dato, redirecciono a esta form, el cual va a consultar en la DB y mostrar los resultados.
router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({ date: 'desc' }).lean();
    // acá lo mando a la nueva vista con la busqueda.
    res.render('notes/all-notes', { notes });
});

//Creamos una ruta y el codigo necesario para modificar las notes
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    // Primero busco la nota con la id que devuelve el boton de la card.
    const note = await Note.findById(req.params.id).lean();
    // Lo envio a la nueva página de edición con su respectiva card de Notes.
    res.render('notes/edit-note', { note });
});

// Aca definimos el put (Update) de la respectiva card que se esté modificando
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Nota actualizada correctamente.');
    res.redirect('/notes');
});

// Aca definimos el delete de la respectiva card que se desea borrar
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota borrada satisfactoriamente.');
    res.redirect('/notes');
});

module.exports = router;