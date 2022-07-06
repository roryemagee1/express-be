const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors());

// const express = require('express')
// const app = express()
// const environment = process.env.NODE_ENV || 'development'
// const configuration = require('./knexfile')[environment]
// const database = require('knex')(configuration)

// app.use(express.static('public'));
// app.get('/', (request, response) => {});

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Pet Box';

app.locals.pets = [
  { id: 'a1', name: 'Jessica', type: 'dog' },
  { id: 'b2', name: 'Marcus Aurelius', type: 'parakeet' },
  { id: 'c3', name: 'Craisins', type: 'cat' }
];

app.get('/', (request, response) => {
  response.send('Oh hey Pet Box');
  // response.send(app.locals.pets[0].name);
});



app.get('/api/v1/pets', (request, response) => {
  const pets = app.locals.pets;

  response.json({ pets });
});

// app.get('/api/v1/pets/:id', (request, response) => {
//   // response.json({
//   //   id: request.params.id
//   // });
//   const pets = app.locals.pets;
//   const output = pets.find(pet => pet.id === request.params.id)
//   response.status(200).json( output );
// });

app.get('/api/v1/pets/:id', (request, response) => {
  const { id } = request.params;
  const pet = app.locals.pets.find(pet => pet.id === id);
  if (!pet) {
    return response.sendStatus(404);
    // const err = { 'err': '404 Not Found' };
    // return response.status(404).json(err.err);
  }

  response.status(200).json(pet);
});

app.post('/api/v1/pets', (request, response) => {
  const id = Date.now();
  const pet = request.body;

  for (let requiredParameter of ['name', 'type']) {
    if (!pet[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  const { name, type } = pet;
  app.locals.pets.push({ name, type, id });
  response.status(201).json({ name, type, id });
});

app.patch('/api/v1/pets/:id', (request, response) => {
  const id = request.params.id;
  const pet = request.body;
  console.log(pet);
  const found = app.locals.pets.find(pet => pet.id === id);
  console.log(found)

  if (!found) {
    response.status(400).json({ message: `No item was found with id of ${request.params.id}.`})
  }

  // if (!pet.name && !pet.type) {
  //   response
  //     .status(422)
  //     .send({ error: `Expected either name: <String> or type: <String> in body. You're missing one or the other or both.` });
  // }

  const change = { name: request.body.name || found.name, type: request.body.type || found.type, id: found.id}
  app.locals.pets = app.locals.pets.map(pet => {
    if (pet.id === id) {
      return change;
    } else {
      return pet;
    }
  });
  response.status(200).json({ message: `The item with id of ${request.params.id} has been updated.`});

});

app.patch('/api/v1/pets/:id', (request, response) => {
  const id = request.params.id;
  const found = app.locals.pets.find(pet => pet.id === id);

  if (!found) {
    response.status(400).json({ message: `No item was found with id of ${request.params.id}.`})
  }
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});