import http from 'http'
import express from 'express'
import alumnos from './utils/mockup'
import MongoDB from './lib/mongo'

const mongo = new MongoDB()
const app = express()

app.use(express.json());

let date = new Date();

app.get('/', (request, response) => {
    response.json(alumnos)
})

app.get('/info', (request, response) => {
    response.send(`<h1>Phonebook has info for  ${alumnos.length}  people</h1><h1>`+ date + '</h1>')
})


app.get('/info/:id', (request, response) => {
    const id = request.params.id
    const note = alumnos.find(alumno => alumno.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.get('/api/alumnos',(request,response) => {
    response.send(alumnos);
});

app.get('/api/alumnos/:id', (request, response) => {
    const id = request.params.id
    const alumno = alumnos.find(alumno => alumno.id === id)
    
    if (!alumno) {
        response.status(404).send(`No se ha encontrado el registro con el id ${request.params.id}.`)
    } else {
        response.send(alumno); 
    }
});

app.delete('/api/alumnos/:id', (request, response) => {
    const id = request.params.id
    alumno = alumnos.filter(alumno => alumno.id !== id)
  
    response.status(204).end()
});

app.post('/api/alumnos', (request, response) => {

    if(!request.body.nombre){
        response.status(400).send({ error: 'name must be unique' })
        return;
    }else if(!request.body.numero){
        response.status(400).send({ error: 'number must be unique' })
        return;
    }

    const alumno = {
        nombre: request.body.nombre,
        numero: request.body.numero,
    };
    console.log(alumno)
    mongo.create('alumno',alumno)
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

