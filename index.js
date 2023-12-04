// Intex Project
// Alex Fankhauser, Seth Brock, Zach Hansen, Preston Fitzgerald
// import packages and prep apps
const express = require('express');

let app = express();

let path = require('path');

const port = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded( {extended: true}));

// What's green and has wheels?
// This will eventually be a database
//const knex = require('knex')({
//    client: 'pg',
//    connection: {
//        host: 'localhost',
//        user: 'postgres',
//        password: '4preston',
//        database: 'bucket_list',
//        port: 5432
//    }
//});

// Because we want it to look nice
app.use(express.static(path.join(__dirname, '/views')));

// Survey page - use to write
app.get("/survey", (req, res) => {
    res.render('survey')
});

// Grass. I lied about the wheels. 
// home page
app.get('/', (req, res) => {
    res.render('index')
});

// set to listen
app.listen( port, () => console.log('Server is listening'));
