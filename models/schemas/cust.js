const { Schema, model, SchemaTypes } = require("mongoose");

const bcrypt = require("bcrypt");

// @note - this model will change according to the one used by signup backend team, according to how the info is originally stored
const customer = Schema({
	uname: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		index: true,
	},
	fullname: String,
	email: {
		// email or mobile one of them should be required
		type: String,
		unique: true,
	},
	mobile: {
		type: Number,
		unique: true,
		// BUT, ALLOW NULL values
	},
	pass: {
		type: String,
		required: true,
		alias: "password", // not stored on db
	},
	firstName: {
		
	},
	surname: {
		
	},
});

customer.virtual('fullName').get(function() {
	return this.firstName +  ' ' + this.surname;
})

customer.pre("save", function (next) {
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

customer.statics.authenticate = (uname, pass) => (
	new Promise((resolve, reject) => {
		custModel.findOne({ uname }, (err, doc) => {
			if (err) {
				return reject(err);
			} else if (!doc) {
				//couldn't find a matching document
				err = { msg: `User Not Found` };
				err.status = 401;

				return reject(err);
			}

			bcrypt
				.compare(pass, doc.pass)
				.then((result) => {
					if (result === true) {
						console.log(`Successful Login of ${uname}`);
	
						return resolve(doc);
					} else {
						console.log(`Failed login attempt by ${uname}`);
						err = { message: `Failed Login Attempt` };
						err.status = 401;
	
						return reject(err);
					}
				})
				.catch((err) => {
					err.message = `Password comparison failed with an error`;

					return reject({ msg: err.message, code: err.code });
				});
		});
	})
);

const custModel = model("customers", customer);
module.exports = custModel;
