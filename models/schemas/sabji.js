const { Schema, model } = require("mongoose");

const sabjiSchema = Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    price: {    /** @note - ONLY show the price at frontend if not_avail is true, but opposite not true, can store price, even if not available */
        type: Number,
        min: 1,
        required: true,
    },
    unit: { // later add check whether unit has a unit at end in the string or not. for eg. both 500gm and k g are accetable
        type: String,
        lowercase: true
    },
    offer: {    // note -> In this case add both price / unit
        type: Boolean,  // true means, this is an offer price
        required: false
    },
    not_avail: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        trim: true,
        required: false
    }
})

// sabjiSchema.pre("save", function(next) {
//     if ( this.not_avail === false && this.price ){
//         console.error(`Price of ${this.name} was not given, even though item is avaiable`);
//         next ( new Error("Price was not given, even though item is avaiable") );
//     }else{
//         next(null);
//     }
// })

module.exports = model("sabjis", sabjiSchema);
