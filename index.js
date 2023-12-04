// Intex Project
// This is the index.js page. It is the brains of the node application that links everything together. 
// Alex Fankhauser, Seth Brock, Zach Hansen, Preston Fitzgerald
// import packages and prep apps
const express = require('express');

let app = express();

let path = require('path');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

// What's green and has wheels?
// This will eventually be a database
//const knex = require('knex')({
//    client: 'pg',
//    connection: {
//        host: process.env.RDS_HOSTNAME || 'localhost',
//        user: process.env.RDS_USERNAME || 'postgres',
//        password: process.env.RDS_PASSWORD || '4preston',
//        database: process.env.RDS_DB_NAME || 'bucket_list',
//        port: process.env.RDS_PORT || 5432
//        ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
//    }
//});

// Because we want it to look nice
app.use(express.static(path.join(__dirname, '/views')));

var accountStatus = false;

// Survey page - use to write
app.get("/survey", (req, res) => {
    if (accountStatus == true) {
        res.render('survey',{
            login: accountStatus
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
        login: accountStatus
    })
})

app.get('/login',(req,res) => {
    res.render('login')
})

app.get('/account', (req, res) => {
    res.render('account')
})

//Log in log out functions
app.get('/loggedin',(req,res) => {
    accountStatus = true;
    res.render('index',{
        login: accountStatus
    })
})

app.get('/loggedout',(req,res) => {
    accountStatus = false;
    res.render('index',{
        login: accountStatus
    })
})

// Grass. I lied about the wheels. 
// home page
app.get('/', (req, res) => {
    res.render('index',{
        login: accountStatus
    })
});

// set to listen
app.listen( port, () => console.log('Server is listening'));
