const { Schema, model, SchemaTypes, ObjectId } = require("mongoose");

// this is for display pictures
const bcrypt = require("bcrypt");

// @note - this model will change according to the one used by signup backend team, according to how the info is originally stored
const dp = Schema({
	userid: {
		type: ObjectId,
		unique: true,
		required: true,
		index: true,
	},
    dp: {
        type: Buffer,
        contentType: String
    }
});

module.exports = model("display_pics", dp);
