// Intex Project
// This is the index.js page. It is the brains of the node application that links everything together. 
// Alex Fankhauser, Seth Brock, Zach Hansen, Preston Fitzgerald
// import packages and prep apps
const express = require('express');

let app = express();

let path = require('path');

const port = process.env.PORT || 3000;

const session = require('express-session');

const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// What's green and has wheels?
// Connect to the database
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.RDS_HOSTNAME || 'awseb-e-3dufqi35us-stack-awsebrdsdatabase-nlgbmm88ql1w.cjrehplvv4i8.us-east-1.rds.amazonaws.com',
        user: process.env.RDS_USERNAME || 'intexAdmin',
        password: process.env.RDS_PASSWORD || '1nt3xis$uperCrazy!',
        database: process.env.RDS_DB_NAME || 'ebdb',
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    }
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());

// initialize the cookie to not logged in
app.use((req, res, next) => {
    req.session.login = false;
    next();
  });

// Because we want it to look nice
app.use(express.static(path.join(__dirname, '/views')));

var accountStatus = true;

app.get('/test', (req, res) => {
    knex.select().from('Accounts').then( Accounts => {
        res.render('displayCountry', { account : Accounts });
    });
});

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
    if (req.session.login == true)
    {
        res.render('account')
    }
    else
    {
        res.render('login')
    }
})

app.get('/account', (req, res) => {
    if (req.session.login == true)
    {
        res.render('account');
    }
    else
    {
        res.render('login');
    }
})

app.post('/newSurvey', (req, res) => {
    res.render('index')
})

//Log in log out functions
// app.post('/validate',(req,res) => { //This is the route called by the login function
//     if ((req.body.username == 'admin') && (req.body.password == 'badmin')) // the req.body is querying the post body from the log in page
//     {
//         res.render('loggedin'); // if the username and password match, this sends the user to the loggedin.ejs page

//     } 

//     // if you get here, your username or password was wrong and you got an error
//     let sOutput;
    
//     sOutput = req.body.username + " " + req.body.password + '!';

//     res.send(sOutput); 
// })

// http://localhost:3000/auth
app.post('/validate', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM public."Accounts" WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


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
