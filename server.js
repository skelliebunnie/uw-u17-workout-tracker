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

var hbsHelpers = exphbs.create({
  helpers: require('./config/hbs-helpers.js').helpers,
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine("hbs", hbsHelpers.engine);
app.set("view engine", "hbs");


// Mongoose connection
const db = require('./models');

mongoose.connect(process.envMNGODB_URI || "mongodb://localhost/workoutplanner", {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

// https://dev.to/abourass/how-to-solve-the-own-property-issue-in-handlebars-with-mongoose-2l7c
function mongooseToObj(arr) {
	let tempArray = [];
	if(arr.length !== 0) {
		arr.forEach( doc => tempArray.push( doc.toObject() ) );
	}

	return tempArray;
}

// sample get route
app.get('/', function(req, res) {

	db.Workout.find()
	.populate({
		path: 'exercises',
		model: 'Exercise',
		// populate: {
		// 	path: 'exercises',
		// 	model: 'Exercise'
		// }
	})
	.then( workoutData => {
		const workouts = mongooseToObj(workoutData);

		db.Exercise.find()
		.then( exerciseData => {
			const exercises = mongooseToObj(exerciseData);

			let activeWorkout;
			for(var i in workouts) {
				if(workouts[i].isActive) {
					activeWorkout = workouts[i];
				}
			}

			res.render('index', { workouts: workouts, exercises: exercises, activeWorkout: activeWorkout });

		});

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

app.put('/api/exercises/:id', function(req, res) {
	let id = req.params.id;

	db.Exercise.findByIdAndUpdate(id, req.body, (err, data) => {
		if(err) {
			console.log(chalk.bgRed(` ${err} `));
		} else {
			res.json(data);
		}
	});

});

app.delete('/api/exercises/:id', function(req, res) {
	db.Exercise.deleteOne({ _id: req.params.id }).then(data => {
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
});

app.get('/api/workouts', function(req, res) {
	db.Workout.find()
	.populate('exercises')
	.then(data => {
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

app.put('/api/workouts/:id', function(req, res) {
	let id = req.params.id;
	console.log(req.params.id, req.body);

	db.Workout.findByIdAndUpdate(id, req.body, (err, data) => {
		if(err) {
			console.log(chalk.bgRed(` ${err} `));
		} else {
			res.json(data);
		}
	});

});

app.delete('/api/workouts/:id', function(req, res) {
	db.Workout.deleteOne({ _id: req.params.id }).then(data => {
		res.json(data);
	}).catch(err => {
		console.log(err);
		res.send(err);
	});
});

// app.get('/api/schedule', function(req, res) {
// 	db.Day.find()
// 	.populate({
// 		path: 'workouts',
// 		model: 'Workout',
// 		populate: {
// 			path: 'exercises',
// 			model: 'Exercise'
// 		}
// 	})
// 	.then(data => {
// 		res.json(data);

// 	}).catch(err => {
// 		console.log(err);
// 		res.send(err);

// 	});
// });

// app.post('/api/schedule', function(req, res) {
// 	db.Day.create(req.body).then(data => {
// 		res.json(data);
// 	}).catch(err => {
// 		console.log(err);
// 		res.send(err);
// 	});
// });

app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log('Server listening on: http://localhost: ' + PORT);
});