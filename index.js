const express = require('express')
const app = express()
const bodyParser = require('body-parser');

// require("./src/database/connection");
const { User, Todo } = require("./models");

app.use(bodyParser.json());

// Handling form values
app.use(express.urlencoded({
  extended: true
}))
app.set("view engine", "ejs");

// Routes
app.get("/", (request, response) => {
  // response.send("<h1>Welcome to your first EJS app!</h1>");
  response.render("index"); // index refers to index.ejs
});
app.get("/users/sign_up", (request, response) => {
  response.render("sign_up");
});

app.get('/todos', async function (request, response) {
  // Todo.findAll().then(todos => response.json(todos));
  const todos = await Todo.findAll().catch((error) => {
    console.log(error)
  })
  response.json(todos)
})

app.get('/todos/:id', function(request, response) {
  Todo.findAll({ where: { id: request.params.id } }).then(todos => response.json(todos));
});

app.post('/todos', function (request, response) {
  Todo.create({ description: request.body.description, dueDate: request.body.dueDate }).then(function(todo) {
    response.json(todo);
  });
})

app.post('/users', async function (request, response) {
  const user = await User.create({ 
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email, 
    password: request.body.password 
  }).catch((error) => {
    console.log(error)
  });
  response.json(user);
  // response.redirect("/"); // Redirected to root path
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