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

// creating variable for user 
let loginUser

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

        res.redirect('/')
    } catch {
        res.status(500).send()
    }
})

// Login into user's notes -> return success or wrong password or username not found
app.post('/', async (req, res) => {
    const user = await knex('users').where('username', req.body.username)
    console.log(req.body.username)
    console.log(req.body.password)
    console.log(user)
    // const user = users.find(user => user.name = req.body.username)
    if (user[0] == undefined) {
        res.send('No user, please register account!')
    } else {
        try {
            if (await bcrypt.compare(req.body.password, user[0].password)) {
                loginUser = req.body.username;
                res.redirect('/users')
            } else {
                res.send('Wrong password!')
            }
        } catch {
            res.status(500).send();
        }
    }
})

// User Page loading notes out (listing when it renders the page)
app.get('/users', async (req, res) => {
    console.log('login user is:', loginUser)

    let usernote = await knex.select('note', 'id').from('users_notes').orderBy('id').whereIn('user_id', function () { return this.select('id').from('users').where('username', '=', loginUser) })
    console.log(usernote)
    res.render('users', { notes: usernote, user: loginUser.toUpperCase() })
})

//Adding notes
app.post('/users', async (req, res) => {
    console.log(req.body.newNote)
    let writeNote = req.body.newNote
    let userid = await knex.select('id').from('users').where('username', loginUser)
    // find userid of the current user
    console.log(userid[0].id)
    return knex('users_notes')
        .insert({ note: writeNote, user_id: userid[0].id },)
        .then(() => {
            console.log('inserted')
            res.redirect('/users');
        })
});

//Updating notes
app.put('/users/:id', (req, res) => {

    console.log(req.body.newdata)
    let dataID = req.params.id
    console.log(dataID)

    return knex('users_notes').update('note', req.body.newdata).where('id', dataID)
        .then(() => {
            res.send('updated');
        })

})

//Deleting notes
app.delete("/users/:id", (req, res) => {
    let deleteid = req.params.id;
    console.log(deleteid)
    return knex('users_notes').where('id', deleteid).del()
        .then(() => {
            res.send('deleted');
        })
})

app.listen(3000, () => {
    console.log('App running on 3000')
})