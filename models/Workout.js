const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
	name: String,
	isActive: Boolean,
	exercises: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Exercise'
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

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;