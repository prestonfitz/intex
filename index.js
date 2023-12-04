// Intex Project
// This is the index.js page. It is the brains of the node application that links everything together. 
// Alex Fankhauser, Seth Brock, Zach Hansen, Preston Fitzgerald
// import packages and prep apps
const express = require('express');

let app = express();

let path = require('path');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded( {extended: true}));

// What's green and has wheels?
// This will eventually be a database
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '4preston',
        database: 'bucket_list',
        port: 5432
    }
});

//session storage test
//sessionStorage.setItem("login", false);

// Because we want it to look nice
app.use(express.static(path.join(__dirname, '/views')));
var test = false;
// Survey page - use to write
app.get("/survey", (req, res) => {
    if (test == true) {
        res.render('survey',{
            login: ''
        })
    }
    else
        res.render('login')
    // res.render('survey',{
    //     login: true
    })
//})
;

app.get("/graphs", (req,res) => {
    res.render('graphs',{
        login: false
    })
})

app.get('/login',(req,res) => {
    res.render('login')
})



// Grass. I lied about the wheels. 
// home page
app.get('/', (req, res) => {
    res.render('index',{
        login: ''
    })
});

// set to listen
app.listen( port, () => console.log('Server is listening'));
