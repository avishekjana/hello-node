const express = require('express')
const app = express()
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');

require("./src/database/connection");

app.use(bodyParser.json());

// Define TODO model
const Todo = sequelize.define(
  'todos', 
  { description: Sequelize.TEXT, isComplete: { type: Sequelize.BOOLEAN, defaultValue: false }, dueDate: Sequelize.DATE } 
);

// Sync database to create/update tables
sequelize.sync({ force: true })
.then(() => {
  console.log(`Database & tables synced successfully!`);
});

// Routes
app.get('/todos', function (request, response) {
  Todo.findAll().then(todos => response.json(todos));
})

app.get('/todos/:id', function(request, response) {
  Todo.findAll({ where: { id: request.params.id } }).then(todos => response.json(todos));
});

app.post('/todos', function (request, response) {
  Todo.create({ description: request.body.description, dueDate: request.body.dueDate }).then(function(todo) {
    response.json(todo);
  });
})

app.put('/todos/:id', function(request, response) {
  Todo.findByPk(request.params.id).then(function(todo) {
    todo.update({
      description: request.body.description,
      dueDate: request.body.dueDate
    }).then((todo) => {
      response.json(todo);
    });
  });
});

app.listen(3000)