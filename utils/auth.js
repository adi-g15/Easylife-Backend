const jwt = require("jsonwebtoken");
const { random16BaseString } = require("../utils/random");

exports.jwt_sec_token = random16BaseString(10);

/**
 * @brief -> The authentication middleware
 * 
 * This is a middleware that, extracts token from req.headers.authorization,
 * then verify the jwt token using jwt.verify( token, secret, (err,user)=>void )
 */
exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;   // @caution -> Check what headers received

    if( authHeader ){
        const token = authHeader.split(' ')[1]; // since in the format 'Bearer: shdfuhw3r3'
        
        jwt.verify( token, this.jwt_sec_token, (err, user) => {
            if( err ) {
                return res.sendStatus(403);
            }

            req.user = user;    // assign user to req.user
            next();
        });
    }else{
        res.sendStatus(401);    // Unauthorized
    }
};

exports.notOnProduction = (req, res, next) => {
    if( 
        ! process.env.PRODUCTION    /**PRODUCTION isn't defined */
        && 
        ( process.env.NODE_ENV ? ! process.env.NODE_ENV.toLowerCase().startsWith("prod"): true) )    /**NODE_ENV is NOT present or if present, then NOT production */
    {
        next();
    }else{
        res.status(401).send( `Dear ${req.headers.from}, You don't have enough permissions to hit the endpoint... - @AdiG15` )
    }
}
