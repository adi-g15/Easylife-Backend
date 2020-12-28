const custModel = require("../models/schemas/cust");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { isValidPhone, isValidEmail } = require("../utils/validators");

const { jwt_sec_token, notOnProduction } = require("../utils/auth");
const { random16BaseString, randomBinaryString } = require("../utils/random");

/**
 * @brief -> Login Route
 * 
 * @req body -> {uname, pass}
 * 
 * @cmd - curl -X POST localhost:3000/cust/login -H "Content-Type: application/json" -d @data.json
 */
router.post('/login', (req, res) => {
    const { uname, pass } = req.body;

    custModel.authenticate( uname, pass )
                .then((user) => {
                    res.json({
                        user: {
                            uname: user.uname,
                            contact: user.email || user.mobile
                        },
                        token: jwt.sign({
                            uid: uname,  // no scopes for now
                        }, jwt_sec_token)
                    })
                })
                .catch(err => {
                    console.error( uname, err.msg || err);

                    err.status !== 500 ? 
                        res.status(err.status).send({msg: err.msg}):
                        res.sendStatus(500)
                })
})

/**
 * @brief -> Sign Up Route (NOTE-> BOTH login and signup routes will respond with a token when it worked well)
 * 
 * @req body -> {uname, pass, contact}
 */
router.post('/sign_up', (req, res) => {

    const user = {
        pass: req.body.pass
         // this MUST be transported on secure network
    }

    if( !req.body.uname ){  // if uname and contact were same, client side only sends the contact... so we consider uname will be same as contact
        user.uname = req.body.contact;
    } else {
        user.uname = req.body.uname;
    }

    if( isValidPhone(req.body.contact) ){
        user.mobile = parseInt( req.body.contact.split(' ').pop() );    // to remove initial +91, if any
    }else if( isValidEmail(req.body.contact) ) {
        user.email = req.body.contact;
    }else{
        return res.status(401).send({err: 'Contact invalid'});  // @todo -> Use correct status code for invalid data received
    }

    custModel.create( user, (err) => {  // doc not needed to use in callback
        if(err) {
            if(err.code === 11000) {
                // ie. duplicate key

                console.log(`Duplicate Key; Couldn't save user - `, user);
                return res.status(403).send({code: 11000, msg: "You may already have an account here. Try logging in..."});
            }

            console.error(`(${err.code}) Couldn't save user - `, user);
            return res.sendStatus(500);
        }

        // return token
        res.json({
            user: {
                uname: user.uname,
                contact: user.email || user.mobile
            },
            token: jwt.sign({
                        uid: user.uname,  // no scopes for now
                   }, jwt_sec_token)
        });
    })
})

/**
 * @brief -> Create Samples
 * 
 * @note -> Will only run on non-production
 */
router.get('/create_sample', notOnProduction, (req, res) => {
    const list = [];

        // for loop is synchronous
    for (let i = 0; i < 100; i++) {
        list.push({
            name: random16BaseString(6),
            email: `${random16BaseString(4)}@sample.in`,
            mobile: randomBinaryString(10),
            pass: "pass1234"
        });
    }

    custModel.create( list )
                .then(docs => {
                    console.log("Added to db");
                })
                .catch(err => {
                    console.error(err.code);
                })

    res.sendStatus(200);
})

module.exports = router;
