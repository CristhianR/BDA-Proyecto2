import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import CentroAtencion from './Models/CentroAtencion';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/TECHealth');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

//----------------------------------------------- End-points -----------------------------------------------------------

//---------------------------------------- Métodos CRUD para el modelo PELICULAS --------------------------------------------

// GET ALL
router.route('/centroatencion').get((req, res) => {
    CentroAtencion.find((err, centrosAtencion) => {
        if(err){
            console.log(err);
        }else{
            res.json(centrosAtencion);
        }
    });
});

// GET byID
router.route('/centroatencion/:id').get((req, res) => {
    CentroAtencion.findById(req.params.id, (err, centroAtencion) => {
        if(err){
            console.log(err);
        }else{
            res.json(centroAtencion);
        }
    });
});

// POST
router.route('/centroatencion/add').post((req, res) => {
    let centroAtencion = new CentroAtencion(req.body);
    centroAtencion.save()
    .then(centroAtencion => {
        res.status(200).json({'centroAtencion': 'Added successfully'});
    })
    .catch(err => {
        res.status(400).send('Failed to create new record');
    });
});

// UPDATE
router.route('/centroatencion/update/:id').post((req, res) => {
    CentroAtencion.findById(req.params.id, (err, centroAtencion) => {
        if(!centroAtencion){
            return next(new Error('Could not load document'));
        }else{
            centroAtencion.CodigoCentro = req.body.CodigoCentro;
            centroAtencion.Nombre = req.body.Nombre;
            centroAtencion.Ubicacion = req.body.Ubicacion;
            centroAtencion.CapacidadMaxima = req.body.CapacidadMaxima;
            centroAtencion.TipoCentro = req.body.TipoCentro;
            
            centroAtencion.save().then(centroAtencion => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

// DELETE
router.route('/centroatencion/delete/:id').get((req, res) => {
    CentroAtencion.findByIdAndRemove({_id: req.params.id}, (err, centroAtencion) => {
        if(err){
            res.json(err);
        }else{
            res.json('Remove successfully');
        }
    })
})

app.use('/', router);

app.get('/', (req, res) => res.send("Hello"));
app.listen(4000, () => console.log('Express server running on port 4000'));