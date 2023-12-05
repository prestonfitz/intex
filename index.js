// Intex Project
// This is the index.js page. It is the brains of the node application that links everything together. 
// Alex Fankhauser, Seth Brock, Zach Hansen, Preston Fitzgerald

// import packages and prep apps
const express = require('express');
const session = require('express-session');
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key', // This should be a long and random string
    resave: false, // Don't save the session if nothing changed
    saveUninitialized: true, // Save new sessions even if not modified
    cookie: {
      maxAge: 60 * 60 * 1000, // Cookie expires in 1 hour
      httpOnly: true, // Prevent JavaScript access to the cookie
    },
  }));

const knex = require('knex')({
  client: 'pg',
  connection: {
      host: process.env.RDS_HOSTNAME || 'localhost',
      user: process.env.RDS_USERNAME || 'postgres',
      password: process.env.RDS_PASSWORD || '4preston',
      database: process.env.RDS_DB_NAME || 'postgres',
      port: process.env.RDS_PORT || 5432,
      ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    }
  });
  
// Because we want it to look nice
app.use(express.static(path.join(__dirname, '/views')));

//Log in log out functions
//log in
app.post('/validate',(req,res) => { //This is the route called by the login function
    let success = false;
    knex.select('Username').from('Accounts').then(uname =>{
      for (icount = 0; icount < uname.length; icount++){
      if (uname[icount].Username == req.body.username){
        console.log("May tagumpay");
        icount2 = icount;
        icount = uname.length;
        knex.select('Password','Account_Num').from('Accounts').where('Username',req.body.username).then(pass =>{
          if (pass[0].Password == req.body.password)
          {
            console.log('May tagumpay ulit');
            req.session.loggedIn = true;
            req.session.userid = pass[0].Account_Num;
            console.log(req.session.userid);
            console.log(req.session.loggedIn);
            success = true;
            res.redirect('/account')
          }
          // else 
          // {console.log('error2'); res.redirect('/login')}
          //{res.render('login', { errorMessage: 'Incorrect username or password' });}
          //{ console.log('error2'); res.render('login', {error: 'Incorrect username or password'})}
        })
      }
      
    }
    if (success == false)
    {console.log('you suck')}
    });
    //console.log('error1'); res.redirect('/login');
    // console.log(req.session.loggedIn);
    //res.redirect('/login');
})


//Protected routes
//These are used to see if someone is logged in

//This protects the account route
// app.use('/account', (req, res, next) => {
//   console.log(req.session.loggedIn)
//   if (!req.session.loggedIn) {
//     return res.redirect('/login');
//   }
//   next(); // Allow access to protected route
// });

//pages
//data page
app.get("/graphs", (req,res) => {
  res.render('graphs')
});

// Survey page - use to write
app.get("/survey", (req, res) => {
  res.render('survey')});

// This verifies Database functionality
app.get('/test', (req, res) => {
  knex.select().from('Accounts').then( Accounts => {
      res.render('displayCountry', { account : Accounts });
  });
});

//This is the login page
app.get('/login',(req,res) => {
    res.render('login')
})

//This is the accounts page
app.get('/account', (req, res) => {
  knex.select().from('Accounts').where('Username', 'admin').then(account =>{
    res.render('account', {myaccount: account});
  }).catch( err => {
    console.log(err);
    res.status(500).json({err});
 });
});

//This is an accountant
app.post("/editAccount", (req, res)=> {
  knex("Accounts").where("Account_Num", parseInt(req.body.Account_Num)).update({
    Username: req.body.Username,
    Password: req.body.Password,
    Email: req.body.Email,
 }).then(myaccount => {
    res.redirect("/");
 })
});

// home page
app.get('/', (req, res) => {
    res.render('index')
});

// set to listen
app.listen( port, () => console.log('Server is listening'));