const jwt = require("jsonwebtoken");
const { random16BaseString } = require("../utils/random");

exports.jwt_sec_token = random16BaseString(10);

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;   // @caution -> Check what headers received

    if( authHeader ){
        const token = authHeader.split(' ')[1]; // since in the format 'Bearer: shdfuhw3r3'
        
        jwt.verify( token, this.jwt_sec_token, (err, user) => {
            if( err ) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    }else{
        res.sendStatus(401);
    }
};
