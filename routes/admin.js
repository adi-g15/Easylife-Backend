const router = require("express").Router();
const admin_auth_ware = require("../middlewares/admin_auth");
const adminModel = require("../models/schemas/admin");

/**
 * @brief -> Set the price (or not avaialable etc) of some product
 * 
 * @request_body -> Contains keys that need to be updated, for eg. ->
 * {
 *      price: 56,
 * }
 * 
 */
router.get("/set/:prod_id", admin_auth_ware, (req, res) => {

})

module.exports = router;