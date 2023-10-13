import express from "express";
import exphbs from "express-handlebars";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
const app = express();
const PORT = 3000;
import db from "./models/index.cjs";
const Todo = db.Todo;
const User = db.User;
import usePassport from './config/passport.js'

// const Todo = db.Todo;
// console.log(User);

app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
usePassport(app)

app.get("/", (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true,
  })
    .then((todos) => {
      return res.render("index", { todos: todos });
    })
    .catch((error) => {
      return res.status(422).json(error);
    });
});
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findByPk(id)
    .then((todo) => res.render("detail", { todo: todo.toJSON() }))
    .catch((error) => console.log(error));
});
app.get("/users/login", (req, res) => {
  res.render("login");
});
app.post("/users/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}));

app.get("/users/register", (req, res) => {
  res.render("register");
});

app.post("/users/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      return res.render("register", {
        name,
        email,
        password,
        confirmPassword,
      });
    }
    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
        })
      )
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  });
  // User.create({ name, email, password })
  //   .then((user) => res.redirect("/"))
  //   .catch((error) => {
  //     console.error(error);
  //   })
});

app.get("/users/logout", (req, res) => {
  res.send("logout");
});
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
