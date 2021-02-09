const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
	name: String,
	reps: Number,
	sets: Number,
	duration: Number, // in minutes
	isCardio: Boolean,
	weight: Number // in pounds
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;