const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");

// @note - this model will change according to the one used by signup backend team, according to how the info is originally stored
const adminSchema = Schema({
	name: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		index: true,
	},
	email: {
		// email or mobile one of them should be required
		type: String,
		unique: true,
	},
	mobile: {
		type: Number,
		unique: true,
	},
	pass: {
		type: String,
		required: true,
		alias: "password", // not stored on db
	},
});

adminSchema.pre("save", function (next) {
	if (!this.email && !this.mobile) {
		console.error(`Atleast email or mobile number, ${this.userName}`);
	}

	const salt_rounds = 10; //to be able to change, as the app scales	// @note - can be replaced with just bcrypt.hash later
	bcrypt
		.genSalt(salt_rounds)
		.then((salt) => {
			//using arrow function, so that `this` reference doesn't change
			bcrypt
				.hash(this.pass, salt)
				.then((encrypted) => {
					this.pass = encrypted;
					next();
				})
				.catch((err) => {
					console.error(`Error in generating encrypted password, ${err.code}`);
					next(err);
				});
		})
		.catch((err) => {
			console.error(`Error in generating salt, ${err.code}`);
			next(err);
		});
});

const adminModel = model("admins", adminSchema);
// @todo - Modify this static authenticate function to return a promise, instead of using the callback
adminSchema.statics.authenticate = function (user_id, pass, callback) {
	adminModel.findOne({ userName: user_id }, (err, doc) => {
		if (err) {
			return callback(err);
		} else if (!doc) {
			//couldn't find a matching document
			err = { msg: `User ${user_id} Not Found` };
			err.status = 401;

			return callback(err);
		}
		bcrypt
			.compare(pass, doc.pass)
			.then((result) => {
				if (result === true) {
					console.log(`Successful Login of ${user_id}`);

					return callback(null, doc);
				} else {
					console.log(`Failed login attempt by ${user_id}`);
					err = { message: `Failed Login Attempt` };
					err.status = 401;

					return callback(err);
				}
			})
			.catch((err) => {
				err.message = `Password comparison failed with an error`;
				console.error(err.message, err);

				return callback({ msg: err.message, code: err.code });
			});
	});
};

module.exports = adminModel;
