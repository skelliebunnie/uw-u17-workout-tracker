const express = require('express');
var exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('morgan');
// for colorful console.logs
const chalk = require('chalk');

const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

// create handlebars engine
var handlebars = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  // partialsDir: path.join(__dirname, 'views/partials'),
  defaultLayout: 'main',
  extname: 'hbs',
  // helpers: require('./config/handlebars-helpers')
});

// Set Handlebars as the default templating engine
// using the engine created above
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));


// Mongoose connection
const db = require('./models');

mongoose.connect(process.envMNGODB_URI || "mongodb://localhost/workoutplanner", {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
})

// sample get route
app.get('/', function(req, res) {
	db.Workout.find()
	.populate('exercises')
	.then( data => {
		data = JSON.stringify(data);

		res.render('index', JSON.parse(data));

	}).catch(err => {
		console.log(err);
		res.send(err);
	})
});

app.get('/api/exercises', function(req, res) {
	db.Exercise.find( (err, data) => {
		
		if(err) {
			console.log(err);
		} else {
			res.json(data);
		}
	});
});

app.post('/api/exercises', function(req, res) {
	db.Exercise.create(req.body).then(data => {
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
});

app.get('/api/workouts', function(req, res) {
	db.Workout.find().then(data => {
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
});

app.post('/api/workouts', function(req, res) {
	db.Workout.create(req.body).then(data => {
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
});

app.get('/api/schedule', function(req, res) {
	db.Day.find().then(data => {
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
});

app.post('/api/schedule', function(req, res) {
	db.Day.create(req.body).then(data => {
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
});

app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log('Server listening on: http://localhost: ' + PORT);
});