const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DaySchema = new Schema({
	date: Date,
	workouts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Workout'
		}
	]
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

const Day = mongoose.model("Day", DaySchema);

module.exports = Day;