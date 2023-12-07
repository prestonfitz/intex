// Intex Project
// This is the index.js page. It is the brains of the node application that links everything together. 
// Alex Fankhauser, Seth Brock, Zach Hansen, Preston Fitzgerald

// import packages and prep apps. Express is for running the backend, express-session is for baking cookies. 
const express = require('express');
const session = require('express-session');
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();
// load static
app.use(express.static(path.join(__dirname, '/html')));
// Use ejs to get access to database and other fun things
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

// Preheating the oven. We don't have a very strong log on our oven
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
    res.redirect('/loggedin')
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
      res.redirect('/loggedOut')
    })
  })
})

//Protected routes
//These are used to see if someone is logged in

// trying the redirect stuff
app.use('/admin', (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect('/graphs')
  }
  next();
})

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

app.use('/loggedin', (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect('/relogin');
    console.log('here');
  }
  console.log('there')
  next();
})

//pages
//data page
app.get('/relogin', (req,res) =>{
  res.render('relog')
})

app.get("/graphs", (req,res) => {
  res.render('graphs')
});

app.get('/admin', (req, res) => {
	knex.select(
		'pd.Participant_ID',
		'pd.Timestamp',
		'pd.Age',
		'pd.Gender',
		'pd.City',
		'pd.Relationship_Status',
		'pd.Occupational_Status',
		knex.raw('STRING_AGG(po.Affiliation_Num::VARCHAR, ?) AS Affiliation_Num', [', ']),
		knex.raw('STRING_AGG(ao.Organization_Description::VARCHAR, ?) AS Organization_Description', [', ']),
		'pd.SM_Use',
		knex.raw('STRING_AGG(pp.Platform_Num::VARCHAR, ?) AS Platform_Num', [', ']),
		knex.raw('STRING_AGG(p.Platform_Name::VARCHAR, ?) AS Platform_Name', [', ']),
		'pd.SM_Time',
		'pd.SM_No_Purpose',
		'pd.SM_Distraction',
		'pd.SM_Restless_Withdrawal',
		'pd.Easily_Distracted',
		'pd.Worries',
		'pd.Concentration_Difficulty',
		'pd.SM_Comparing',
		'pd.SM_Comparing_Feel',
		'pd.SM_Validation',
		'pd.Depressed_or_Down',
		'pd.Activity_Interest',
		'pd.Sleep_Issues'
	  )
	  .from('PersonalDetails as pd')
	  .leftJoin('ParticipantOrganizations as po', 'pd.Participant_ID', 'po.Participant_ID')
	  .leftJoin('ParticipantPlatforms as pp', 'pd.Participant_ID', 'pp.Participant_ID')
	  .leftJoin('Platforms as p', 'pp.Platform_Num', 'p.Platform_Num')
	  .leftJoin('AffiliatedOrganizations as ao', 'po.Affiliation_Num', 'ao.Affiliation_Num')
	  .groupBy(
		'pd.Participant_ID',
		'pd.Timestamp',
		'pd.Age',
		'pd.Gender',
		'pd.City',
		'pd.Relationship_Status',
		'pd.Occupational_Status',
		'pd.SM_Use',
		'pd.SM_Time',
		'pd.SM_No_Purpose',
		'pd.SM_Distraction',
		'pd.SM_Restless_Withdrawal',
		'pd.Easily_Distracted',
		'pd.Worries',
		'pd.Concentration_Difficulty',
		'pd.SM_Comparing',
		'pd.SM_Comparing_Feel',
		'pd.SM_Validation',
		'pd.Depressed_or_Down',
		'pd.Activity_Interest',
		'pd.Sleep_Issues'
	  )
	  .orderBy('pd.Timestamp', 'asc')
	  .orderBy('pd.Participant_ID', 'asc')
		.then(personalDetails => {
	res.render("admin", {personalDetails: personalDetails});
}).catch( err => {
	console.log(err);
	res.status(500).json({err});
});
});

//this route creates a page to display selected survey information
app.post("/details",  (req, res)=> {
  knex.select("pd.Participant_ID", 
              "pd.Timestamp", 
              "pd.Age", 
              "pd.Gender", 
              "pd.City",
              "pd.Relationship_Status",
              "pd.Occupational_Status",
              'pd.SM_Use',
              'pd.SM_Time',
              'pd.SM_No_Purpose',
              "pd.SM_Distraction",
              'pd.SM_Restless_Withdrawal',
              'pd.Easily_Distracted',
              'pd.Worries',
              'pd.Concentration_Difficulty',
              'pd.SM_Comparing',
              'pd.SM_Comparing_Feel',
              'pd.SM_Validation',
              'pd.Depressed_or_Down',
              'pd.Activity_Interest',
              'pd.Sleep_Issues',
              'p.Platform_Name',
              'ao.Organization_Description')
              .from("PersonalDetails as pd")
              .innerJoin('ParticipantPlatforms as pp', 'pd.Participant_ID', 'pp.Participant_ID')
              .innerJoin('Platforms as p', 'pp.Platform_Num', 'p.Platform_Num')
              .innerJoin('ParticipantOrganizations as po', "pd.Participant_ID", "po.Participant_ID")
              .innerJoin('AffiliatedOrganizations as ao', "po.Affiliation_Num", "ao.Affiliation_Num")
              .where("pd.Participant_ID", req.body.userid).then(surveyDetails => {
  res.render("details", {surveyDetails: surveyDetails});
 }).catch( err => {
    console.log(err);
    res.status(500).json({err});
 });
});

app.get('/userView', (req, res) => {
  res.render('graphs')
})

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
  // grab the usernames from the database
  knex.select('Username').from('Accounts').then(uname =>{
    let aUsernames = [];
    let limit = uname.length;
    for(iCount = 0; iCount < uname.length + 1; iCount++)
    {
      aUsernames.push(uname[0].Username);
      uname.shift();
    }
    // if the username is not in the database or if it is equal to the logged in account's username
    // go ahead and create the account
    if ((!aUsernames.includes(req.body.Username)) || (req.body.Username == req.session.username))
    { 
    knex("Accounts").where("Account_Num", parseInt(req.body.Account_Num)).update({
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
   }).then(myaccount => {})}

   // otherwise, send them to reedit to do some javascript
    else{return res.render('reedit')}

  // redirect to account page after success
  return res.redirect("/account");})
});

// this is a senior accountant
app.post("/newAccount", (req, res)=> {
  // grab the usernames from the Accounts table in our database and push them to an array
  knex.select('Username').from('Accounts').then(uname =>{
    let aUsernames = [];
    let limit = uname.length;
    for(iCount = 0; iCount < limit; iCount++)
    {
      console.log('uname: ' + String(uname.length))
      aUsernames.push(uname[0].Username);
      uname.shift();
    }
    // check to see if the username is available and if it is, add the account to the database
    if (!aUsernames.includes(req.body.Username)){
    knex("Accounts").insert({
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Admin_Status: req.body.Admin_Status
   }).then(myaccount => {});
  }
  // if the username is not available, send them to the recreate page
  // to do some javascript
  else{return res.render('recreate')}

  // redirect to the account page after successful creation
  res.redirect("/account");
 })
});

// This route is inevitable
app.post("/deleteAccount", (req, res) => {
  // delete the account based on the account_num of the account logged in then send to logout route
  knex("Accounts").where("Account_Num",req.body.Account_Num).del().then( account => {
    res.redirect("/logout");
 }).catch( err => {
    console.log(err);
    res.status(500).json({err});
 });
});

// these are log in log out pages designed to simply set a session storage variable. Don't worry about it. 
app.get('/loggedin', (req, res) => {
  res.render('loggedin')
});

app.get('/loggedOut', (req, res) =>{
  res.render('loggedOut')
});

//This is the new accounts page
app.get('/newAccount', (req, res) => {
  res.render('newAccount')
});

// 127.0.0.1 page
app.get('/', (req, res) => {
    res.render('index')
});

// This function gets the timestamp of the survey submission
function getTodayDate() {
  // Implement this function as per your requirement
  // For example, you can use the JavaScript Date object
  return new Date().toISOString();
}

// sending the survey stuff to the database ya know
app.post("/newSurvey", async (req, res)=> {
  // I will return the participant_id to use in the other tables
  const [participant_id] = await knex("PersonalDetails")
  .returning('Participant_ID')
  .insert({
    Timestamp: getTodayDate(),
    Age: req.body.age,
    Gender: req.body.gender,
    City: req.body.city,
    Relationship_Status: req.body.relationship,
    Occupational_Status: req.body.occupation,
    SM_Use: req.body.useSocial,
    SM_Time: req.body.timeOutput2,
    SM_No_Purpose: req.body.np,
    SM_Distraction: req.body.dsm,
    SM_Restless_Withdrawal: req.body.rw,
    Easily_Distracted: req.body.ed,
    Worries: req.body.w,
    Concentration_Difficulty: req.body.dc,
    SM_Comparing: req.body.smc,
    SM_Comparing_Feel: req.body.cf,
    SM_Validation: req.body.val,
    Depressed_or_Down: req.body.dd,
    Activity_Interest: req.body.ai,
    Sleep_Issues: req.body.si
 });

 // redirect the user back to the home page after submitting the survey
 res.redirect('/');

  // create a variable that will hold the array of checked organizations
  const checkboxValuesOrgs = [];

  // show the participant_id to the log just so I know
  console.log(participant_id);

  // Extract selected checkbox values from the request body
  for(let iCount = 1; iCount <= 5; iCount++) {
    const name = `org${iCount}`;
    if (req.body[name]) {
      checkboxValuesOrgs.push(req.body[name]);
    }
  }

  // Insert the checkbox values to the participant organizations table
  // all will have the same participant_id
  await Promise.all(checkboxValuesOrgs.map(async (affiliationNum) => {
    await knex("ParticipantOrganizations").insert({
      Participant_ID: participant_id.Participant_ID,
      Affiliation_Num: affiliationNum
    });
  }));

  // Everything below here is the same thing as above but just for the platforms
  const checkboxValuesSocs = [];

  // Extract selected checkbox values from the request body
  for(let iCount = 1; iCount <= 11; iCount++) {
    const name = `soc${iCount}`;
    if (req.body[name]) {
      checkboxValuesSocs.push(req.body[name]);
    }
  }

  await Promise.all(checkboxValuesSocs.map(async (platformNum) => {
    await knex("ParticipantPlatforms").insert({
      Participant_ID: participant_id.Participant_ID,
      Platform_Num: platformNum
    });
  }));
});

//404
app.get('*', function(req, res){
  res.status(404).render('404');
});

// set to listen
app.listen( port, () => console.log('Server is listening'));