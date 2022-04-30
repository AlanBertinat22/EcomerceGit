// configuro la conexión con la base de datos
const mongoose =  require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/notes-db-app', {

    useNewUrlParser: true, 
    useUnifiedTopology: true

})
    .then(db => console.log('Conectado a la DB'))
    .catch(err => console.error(err));