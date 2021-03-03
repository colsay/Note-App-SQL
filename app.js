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

//bcrypt
const bcrypt = require('bcrypt')

//knex
// const knex = require('./knexfile')
require('dotenv').config();
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.DATABASE,
        user: process.env.USERNAME,
        password: process.env.PASSWORD
    }
});

// 
const users = []

// Login Page

app.get('/', (req, res) => {
    res.render('index')
})

// Register button -> pass registered username and hashed password into SQL
app.post('/login', async (req, res) => {
    console.log(req.body)
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(hashedPassword)
        const user = { name: req.body.username, password: hashedPassword }

        //insert into SQL databse
        knex('users').insert({ username: user.name, password: user.password }).then(function (result) {
            console.log(result, 'working okay')
        })

        //pushing into array to check user
        users.push(user)
        console.log(users)
        res.redirect('/')

    } catch {
        res.status(500).send()
    }
})


// Login into user's notes -> return success or fail
app.post('/', async (req, res) => {
    const user = users.find(user => user.name = req.body.username)
    if (user == null) {
        return res.status(400).send('cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.redi
        } else {
            res.redirect('/users')
        }
    } catch {
        res.status(500).send();
    }
})


// User Page
app.get('/users', (req, res) => {
    res.render('users', { notes: ['variable', 'hello'], user: 'variable' })
})

app.post('/users', (req, res) => {
    console.log(req.body.newNote)
    let note = req.body.newNote
    return knex('users_notes')
        .insert({ note: note, user_id: 1 },)
        .then(() => {
            console.log('inserted')
            res.redirect('/users');
        })
});

app.put('/:id', (req, res) => {


})

app.delete("/:id", (req, res) => {
    let id = request.params.id;


})



app.listen(3000, () => {
    console.log('App running on 3000')
})