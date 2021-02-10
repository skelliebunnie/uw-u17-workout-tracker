const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
	name: String,
	reps: Number,
	sets: Number,
	duration: Number, // in minutes
	isCardio: Boolean, // instead of 'type'
	distance: Number, // for cardio
	weight: Number // in pounds
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;