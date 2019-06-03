const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	author: {
		id : {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		username: {
			type: String
		}
	},
});


module.exports = mongoose.model('Post', postSchema);
