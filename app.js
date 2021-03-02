//New instances


//express
const express = require('express');
const handlebars = require('express-handlebars');
const app = express();

//body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//static files
app.use(express.static("public"));



app.get('/', (req, res) => {
    res.render('index')
})

app.get('/users', (req, res) => {
    res.render('users', { notes: ['variable', 'hello'], user: 'variable' })
})

app.post('/users', (req, res) => {
    console.log(req.body.newNote)

})


app.listen(3000, () => {
    console.log('App running on 3000')
})