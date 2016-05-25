//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var pg = require('pg');
var app = express();

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    console.error('could not connect', err);
  }
  else {
    console.log("Successfully connected");
  }
});

//Configures the Template engine
app.engine('html', handlebars());
app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat',
                  saveUninitialized: true,
                  resave: true}));

//set environment ports and start application
app.set('port', process.env.PORT || 3000);

//routes
app.get('/', function(req, res) {
  res.render('index');
});
app.get('/findout', function(req, res) {
  res.render('idea');
});
app.get('/getaclue', function(req, res) {
  res.render('location');
});
app.get('/map', function(req, res) {
  res.render('map');
});

app.get('/delphidata', function (req, res) {
  // TODO
  // Connect to the DELPHI Database and return the proper information
  // that will be displayed on the D3 visualization
  // Table: Smoking Prevalance in Adults
  // Task: In the year 2003, retrieve the total number of respondents
  // for each gender.
  // Display that data using D3 with gender on the x-axis and
  // total respondents on the y-axis.
  client.query("SELECT gender, number_of_respondents FROM cogs121_16_raw.cdph_smoking_prevalence_in_adults_1984_2013 WHERE year = 2003 ",function(err,data){
      res.json(data.rows);
  });
  //return { delphidata: "No data present." }
});

app.get('/demographics_age', function(req, res) {
  //SELECT "Area", "Total 2012 Population" as "total", "Population 0-4" as "zero_to_4", "Population 15-24" as "fifteen_to_24", "Population 25-44" as "twentyfive_to_44", "Population 65+" as "sixtyfiveplus" FROM cogs121_16_raw.hhsa_san_diego_demographics_county_population_2012

  client.query("SELECT \"Area\", \"Total 2012 Population\" as \"total\", \"Population 0-4\" as \"zero_to_4\"" +
                ",\"Population 15-24\" as \"fifteen_to_24\", \"Population 25-44\" as \"twentyfive_to_44\"" +
                ",\"Population 65+\" as \"sixtyfiveplus\" FROM cogs121_16_raw.hhsa_san_diego_demographics_county_population_2012",
  // client.query("select \"Area\", 100*(\"no vehicle available\"*1.0 / \"total households (occupied housing units)\")" +
  //   " as \"percent\"" +
  //   " from cogs121_16_raw.hhsa_san_diego_demographics_vehicle_availability_2012" +
  //   " where 100*(\"no vehicle available\"*1.0 / \"total households (occupied housing units)\") = (" +
  //   "select MAX( 100*(\"no vehicle available\"*1.0 / \"total households (occupied housing units)\")) as \"percent\" from cogs121_16_raw.hhsa_san_diego_demographics_vehicle_availability_2012)",
                function(err, data) {
    res.json(data.rows);
  });
  // var query = "select \"Area\", 100*(\"no vehicle available\"*1.0 / \"total households (occupied housing units)\")" +
  //   " as \"percent\"" +
  //   " from cogs121_16_raw.hhsa_san_diego_demographics_vehicle_availability_2012" +
  //   " where 100*(\"no vehicle available\"*1.0 / \"total households (occupied housing units)\") = (" +
  //   "select MAX( 100*(\"no vehicle available\"*1.0 / \"total households (occupied housing units)\")) as \"percent\" from cogs121_16_raw.hhsa_san_diego_demographics_vehicle_availability_2012)";

});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
