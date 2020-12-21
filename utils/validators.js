exports.isUserNameValid = (uname) => {
	if(  typeof uname !== "string" )	return false;

	return new RegExp(/^[a-zA-Z0-9_-]{3,16}$/u, "u")
				.test(uname);
}

exports.isValidEmail = (email) => {
	if(  typeof email !== "string" )	return false;

	return new RegExp(/^.+@.+$/u, "u")
				.test(email);
}

exports.isValidPhone = (contact) => {
	if(  typeof contact !== "string" && typeof contact !== 'number' ){
		return false;
	}

	contact = contact.toString()	// so that both string and number behave same way
	if( contact.startsWith('+91') ){
		contact = contact.split(' ').pop();	// to get last of the splitted string
	}

	return contact.length === 10 && contact.every( (ch) => (ch => ch >= '0' && ch <= '9') );
}
