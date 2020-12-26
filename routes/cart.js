const router = require("express").Router();
const authWare = require("../middlewares/auth");
const { getCartTotal } = require("../utils/cart");
const sabjiModel = require("../models/schemas/sabji");

/**
 * @brief -> Recieves LIST of all products in cart, and total cart price computed, from react too, then the API recomputes, and returns the cart price (if it was different than computed on frontend, then give some error in future)
 * 
 * @note -> The list received here, if has same values will be considered for the purchase ONLY (not the client side's that can have problems)
 * 
 */
router.post('/submit', authWare,(req, res) => {
    const sabji_list = req.body.sabji_ids;
    // const client_total = req.body.total; // this is also expected to be inside the body of cart

    if( !Array.isArray(sabji_list) ){
        return res.sendState(401);  // invalid data, sabji list not sent !!
    }

    getCartTotal(sabji_list, true)
        .then( (resultObj) => {
            if( resultObj.total != req.body.total ){
                console.log(`[${Date()}] Total sent by client side (${req.body.total}) was different than on server side (${resultObj.total})`)

                return res.send({   // for now we won't be returning the cart results rather inform the client side that it was wrong !
                    err: {
                        code: "WRONG_CLIENT_TOTAL"
                    }
                });
            }

            return res.send({
                 data: resultObj.list,
                 total: resultObj.total
            });
        })
        .catch(err => {
            console.error(err);

            res.sendStatus(500);
        })

});

/**
 * @brief -> Though client side will also store the cart total, still when user checks the cart, then call this endpoint, and show the price returned by the server
 * 
 * @response -> If success, then returns a number representing cart total
 */
router.post('/getTotal', authWare,(req, res) => {
    const sabji_list = req.body.sabji_ids;
    // const client_total = req.body.total; // this is also expected to be inside the body of cart

    if( !Array.isArray(sabji_list) ){
        return res.sendState(401);  // invalid data, sabji list not sent !!
    }

    getCartTotal(sabji_list, true)
        .then( (resultObj) => {

            if( resultObj.total != req.body.total ){
                console.log(`[${Date()}] Total sent by client side (${req.body.total}) was different than on server side (${resultObj.total})`)

                return res.send({   // for now we won't be returning the cart results rather inform the client side that it was wrong !
                    err: {
                        code: "WRONG_CLIENT_TOTAL"
                    }
                });
            }

            return res.send({
                 total: resultObj.total
            });
        })
        .catch(err => {
            console.error(err);

            res.sendStatus(500);
        })

});

module.exports = router;