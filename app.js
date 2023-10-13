import express from 'express'
import exphbs from 'express-handlebars'
import methodOverride from 'method-override'
import bodyParser from "body-parser";
import bcrypt from 'bcryptjs'
const app = express()
const PORT = 3000

app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.get('/', (req, res) => {
  res.send('hello world')
})
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
})