const { Schema, model }  = require("mongoose");

const offerSchema = Schema({
    product: String,
    offer_brief: String,
    order_msg: String,
    add_notes: String
});

module.exports = model('offers', offerSchema);
