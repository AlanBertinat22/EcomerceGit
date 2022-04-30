const router = require('express').Router();

// obtengo la ruta donde definí el schema para la base de datos.
// Al crear un schema, es como crear una clase, la misma se tendrá que instanciar
// para luego poder ser utilizada para insertar, modificar o borrar.
const Note = require('../models/Note');

router.get('/notes/add', (req, res) => {
    res.render('notes/new-note');
});

// Creo una direccion de internet exclusivamente para recibir los datos del formulario
router.post('/notes/new-note', async (req, res) => {
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
        await newNote.save();
        req.flash('success_msg', 'Nota agregada exitosamente.');
        res.redirect('/notes')
    }
});

// Una vez que guardo un dato, redirecciono a esta form, el cual va a consultar en la DB y mostrar los resultados.
router.get('/notes', async (req, res) => {
    const notes = await Note.find({}).sort({ date: 'desc' }).lean();
    // acá lo mando a la nueva vista con la busqueda.
    res.render('notes/all-notes', { notes });
});

//Creamos una ruta y el codigo necesario para modificar las notes
router.get('/notes/edit/:id', async (req, res) => {
    // Primero busco la nota con la id que devuelve el boton de la card.
    const note = await Note.findById(req.params.id).lean();
    // Lo envio a la nueva página de edición con su respectiva card de Notes.
    res.render('notes/edit-note', { note });
});

// Aca definimos el put (Update) de la respectiva card que se esté modificando
router.put('/notes/edit-note/:id', async (req, res) => {
    const { title, description } = req.body;
    const note = await Note.findByIdAndUpdate(req.params.id, { title, description });
    res.redirect('/notes');
});

// Aca definimos el delete de la respectiva card que se desea borrar
router.delete('/notes/delete/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/notes');
});

module.exports = router;