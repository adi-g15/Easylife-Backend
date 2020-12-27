const router = require("express").Router();
const sabjiModel = require("../models/schemas/sabji");
const offerModel = require("../models/schemas/offers");

/**
 * @important @note -> Only the routes that return prices, are required now, likely what desription will you give at frontend regarding a vegetable, so that is less important, implement later only if needed
 * 
 */

/**
 * @brief - Get LIST of ALL offers
 * 
 * @auth -> NOT REQUIRED
 */
router.get("/get_offers", (req, res) => {
	offerModel.find({}).lean()
		.then((offers) => {
			if( !offers || offers.length===0 ){
				console.error("No offers available 😢");

				return res.json({data: []});
			}

			console.log(`Sending ${offers.length} offers 🎉`);
			return res.json({data: offers});		
		})
		.catch(err => {
			// error
			console.error(err);

			return res.sendStatus(500);		
		})
});


/**
 * @brief - Get LIST of ALL products AND their prices
 * 
 * @auth -> NOT REQUIRED
 */
router.get("/get_all_prices", (req, res) => {
	sabjiModel.find({})
				.where('not_avail').equals(false)
				.select('-not_avail')
				.lean()
					.then(docs => {
						if( !docs || docs.length===0 ){
							console.error("No sabji available");

							return res.json({data: []});
						}

						console.log(`Sending ${docs.length} sabjis your way 🍅`);

						return res.json({data: docs});
					})
					.catch(err => {
						// error
						console.error(err);

						return res.sendStatus(500);
					})
});

/**
 * @brief fetch latest price as in database
 * 
 * @params -> contains product id
 * 
 * @auth -> NOT REQUIRED
 */
router.get("/get_price/:prod_id", (req, res) => {
	sabjiModel.findOneById( req.params.prod_id )
				.select('price')
				.then(doc => {
					if( !doc ){
						console.error(`Sabji with id: ${req.params.prod_id} not found`);

						return res.sendStatus(204);	// nothing to send, sabji NOT FOUND
						/**
						 * @note -> In this case, client side should remove the sabji for which this API was called,since there may be some changes made to database later
						 */
					}

					return res.json({price: doc.price});
				})
				.catch(err => {
							// error
							console.error(err);

							return res.sendStatus(500);
				})
});

/**
 * @brief - Get LIST of ALL products AND their DESCRIPTIONS
 * 
 * @note -> Don't wait to get response from this, since it can take long time, 
 * 			first /get_all_price, then only call this,
 * 			since the description is only shown when product is clicked not otherwise
 * 
 * @auth -> NOT REQUIRED
 */
router.get("/get_all_desc", (req, res) => {

});

/**
 * @brief - Get MORE info if available, else just respond with price and complete description
 * 
 * @note -> Don't wait to get response from this, since it can take long time, 
 * 			first /get_all_price, then only call this,
 * 			since the description is only shown when product is clicked not otherwise
 * 
 * @auth -> NOT REQUIRED
 */
router.get("/get_info/:id", (req, res) => {
	
});

module.exports = router;
