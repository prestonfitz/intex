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
app.use('/account', (req, res, next) => {
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
  res.render('account')
  //knex.select().from('Accounts').where('');
})

// home page
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
  .returning('participant_id')
  .insert({
    timestamp: getTodayDate(),
    age: req.body.age,
    gender: req.body.gender,
    city: req.body.city,
    relationship_status: req.body.relationship,
    occupational_status: req.body.occupation,
    sm_use: req.body.useSocial,
    sm_time: req.body.time,
    sm_no_purpose: req.body.np,
    sm_distraction: req.body.dsm,
    sm_restless_withdrawal: req.body.rw,
    easily_distracted: req.body.ed,
    worries: req.body.w,
    concentration_difficulty: req.body.dc,
    sm_comparing: req.body.smc,
    sm_comparing_feel: req.body.cf,
    sm_validation: req.body.val,
    depressed_or_down: req.body.dd,
    activity_interest: req.body.ai,
    sleep_issues: req.body.si
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
      Participant_ID: participant_id.participant_id,
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
      Participant_ID: participant_id.participant_id,
      Platform_Num: platformNum
    });
  }));
});

// set to listen
app.listen( port, () => console.log('Server is listening'));