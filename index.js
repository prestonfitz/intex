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
    knex.select('username').from('Accounts').then(uname =>{
      for (icount = 0; icount < uname.length; icount++){
      if (uname[icount].username == req.body.username){
        console.log(req.body.username);
        icount2 = icount;
        icount = uname.length;
        knex.select('password').from('Accounts').where('username',req.body.username).then(pass =>{
          if (pass[0].password == req.body.password)
          {
            console.log('success')
          }
          else {console.log('fail')}
        })
      }
      else{console.log(req.body.password)}}
    })
  
  // if ((req.body.username == 'admin') && (req.body.password == 'badmin')) // the req.body is querying the post body from the log in page
  //   {
  //       req.session.loggedIn = true; 
  //       res.redirect('/loggedin'); // if the username and password match, this sends the user to the loggedin.ejs page
  //   } 
})

app.get('/loggedin',(req,res) => {
  res.render('loggedin')
})

//Protected routes
//These are used to see if someone is logged in

//This protects the account route
app.use('/account', (req, res, next) => {
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
        res.render('account');
})

// home page
app.get('/', (req, res) => {
    res.render('index')
});

// set to listen
app.listen( port, () => console.log('Server is listening'));