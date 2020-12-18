const { authenticateJWT } = require("../utils/auth")

module.exports = (req, res, next) => {
    authenticateJWT(req, res, next);
}
