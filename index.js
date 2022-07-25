const express = require('express')
const bodyParser = require('body-parser');
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login'); //authorization
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const app = express()

const saltRounds = 10;

// Importing models
const { User, Todo } = require("./models");

// Configure Sessions Middleware
app.use(session({
  secret: 'my-super-secret-key-7218728182782818218782718hsjahsu8as8a8su88',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure Middleware to read request body
app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true
}))
app.set("view engine", "ejs");

// Configure middleware for passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ where: { email: username } }).then(async function(user) {
      const cmp = await bcrypt.compare(password, user.password);
      if (cmp) {
        return done(null, user);
      } else {
        return done("Invalid password");
      }
    }).catch((error) => {
      return done(err);
    });
  }
));

// To use with sessions
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  console.log("Serializing user in session: ", user.id)
  done(null, user.id); 
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

// Routes
app.get("/", (request, response) => {
  response.render("index"); // index refers to index.ejs
});

app.get("/login", (request, response) => {
  response.render("login"); // index refers to index.ejs
});
app.post('/session', passport.authenticate('local', { failureRedirect: '/login' }),  function(request, response) {
	response.redirect('/todos');
});

app.get("/signup", (request, response) => {
  response.render("signup");
});
app.post('/users', async function (request, response) {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  const user = await User.create({ 
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email, 
    password: hashedPwd
  }).catch((error) => {
    console.log(error)
  });
  // Create session after successful signup
  request.login(user, function(err) {
    if (err) {
      console.log(err);
    }
    return response.redirect('/todos');
  });
  // response.redirect("/todos"); // Redirected to root path
})

app.get('/signout', function(request, response, next) {
  request.logout(function(err) {
    if (err) { return next(err); }
    response.redirect('/');
  });
});

app.get('/todos', connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const todos = await Todo.findAll().catch((error) => {
    console.log(error)
  })
  response.render("todos");
})

app.get('/todos/:id', connectEnsureLogin.ensureLoggedIn(), function(request, response) {
  Todo.findAll({ where: { id: request.params.id } }).then(todos => response.json(todos));
});

app.post('/todos', connectEnsureLogin.ensureLoggedIn(), function (request, response) {
  Todo.create({ description: request.body.description, dueDate: request.body.dueDate }).then(function(todo) {
    response.json(todo);
  });
})

app.put('/todos/:id', connectEnsureLogin.ensureLoggedIn(), function(request, response) {
  Todo.findByPk(request.params.id).then(function(todo) {
    todo.update({
      description: request.body.description,
      dueDate: request.body.dueDate
    }).then((todo) => {
      response.json(todo);
    });
  });
});

app.listen(3011)