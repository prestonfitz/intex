// Intex Project
// This is the index.js page. It is the brains of the node application that links everything together. 
// Alex Fankhauser, Seth Brock, Zach Hansen, Preston Fitzgerald

// import packages and prep apps. Express is for running the backend, express-session is for baking cookies. 
const express = require('express');
const session = require('express-session');
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();

// Use ejs to get access to database and other fun things
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

// load static
app.use(express.static(path.join(__dirname, '/views/assets')));

// Preheating the oven. We don't have a very strong lock on our oven
app.use(session({
    secret: 'your_secret_key', // This should be a long and random string, but it isn't
    resave: false, // Don't save the session if nothing changed
    saveUninitialized: true, // Save new sessions even if not modified
    cookie: {
      maxAge: 60 * 60 * 1000, // Cookie expires in 1 hour, so eat up
      httpOnly: true, // Prevent JavaScript access to the cookie. Otherwise it would put it in a cookie JAR
    },
  }));

// This app knex the website to a database. 
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
    knex.select('Username').from('Accounts').then(uname =>{
      for (icount = 0; icount < uname.length; icount++){
      if (uname[icount].Username == req.body.username){
        icount = uname.length;
        knex.select('Password','Account_Num', 'Username').from('Accounts').where('Username',req.body.username).then(pass =>{
          if (pass[0].Password == req.body.password)
          {
            req.session.loggedIn = true;
            req.session.userid = pass[0].Account_Num;
            req.session.username = pass[0].Username;
            req.session.save(function (err) { //this is what we were missing for a while when baking cookies
              if (err) return next(err)
            });
          }
        })
      }
      
    }
    res.redirect('/account')
    });
})

//cookie monster
app.get('/logout', function (req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.loggedIn = null
  req.session.userid = null
  req.session.save(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
})

//Protected routes
//These are used to see if someone is logged in

// This protects the account route
// an idea to check changing the username: run an if statement where it is not in the database OR it is the current session username
app.use('/account', (req, res, next) => {
  console.log(req.session.loggedIn)
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }
  next(); // Allow access to protected route
});

//This protects the new account route
app.use('/newAccount', (req, res, next) => {
  console.log(req.session.loggedIn)
  if (!req.session.loggedIn) {
    return res.redirect('/login');
  }
  next(); // Allow access to protected route
});

//pages
//data page
app.get("/graphs", (req,res) => {
  res.render('graphs')
});

// Survey page - use to write
app.get("/survey", (req, res) => {
  res.render('survey')});

// This verifies Database functionality. If it looks like it was stolen from Professor Anderson, just know that it was. Because we knew that it worked.
app.get('/test', (req, res) => {
  knex.select().from('Accounts').then( Accounts => {
      res.render('displayCountry', { account : Accounts });
  });
});

//This is the login page
app.get('/login',(req,res) => {
    res.render('login')
})

//This is the accounts page. It accepts a userid from a cookie and uses that to query the database to get an account
app.get('/account', (req, res) => {
  knex.select().from('Accounts').where('Account_Num', req.session.userid).then(account =>{
    res.render('account', {myaccount: account});
  }).catch( err => {
    console.log(err);
    res.status(500).json({err});
 });
});

//This is an accountant
app.post("/editAccount", (req, res)=> {
  knex.select('Username').from('Accounts').then(uname =>{
    let aUsernames = [];
    let limit = uname.length;
    for(iCount = 0; iCount < uname.length + 1; iCount++)
    {
      aUsernames.push(uname[0].Username);
      uname.shift();
    }
    if ((!aUsernames.includes(req.body.Username)) || (req.body.Username == req.session.username))
    { 
    knex("Accounts").where("Account_Num", parseInt(req.body.Account_Num)).update({
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
   }).then(myaccount => {})}
    else{}
  res.redirect("/account");})
});

// this is a senior accountant
app.post("/newAccount", (req, res)=> {
  knex.select('Username').from('Accounts').then(uname =>{
    let aUsernames = [];
    let limit = uname.length;
    for(iCount = 0; iCount < limit; iCount++)
    {
      console.log('uname: ' + String(uname.length))
      aUsernames.push(uname[0].Username);
      uname.shift();
    }
    if (!aUsernames.includes(req.body.Username)){
    knex("Accounts").insert({
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Admin_Status: req.body.Admin_Status
   }).then(myaccount => {});
  }
  res.redirect("/account");
 })
});

// This route is inevitable
app.post("/deleteAccount", (req, res) => {
  knex("Accounts").where("Account_Num",req.body.Account_Num).del().then( account => {
    res.redirect("/logout");
 }).catch( err => {
    console.log(err);
    res.status(500).json({err});
 });
});

//This is the new accounts page
app.get('/newAccount', (req, res) => {
  res.render('newAccount')
});

// 127.0.0.1 page
app.get('/', (req, res) => {
    res.render('index')
});

// set to listen
app.listen( port, () => console.log('Server is listening'));