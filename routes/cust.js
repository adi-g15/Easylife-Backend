const custModel = require("../models/schemas/cust");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { isValidPhone, isValidEmail } = require("../utils/validators");

const { jwt_sec_token, notOnProduction } = require("../utils/auth");
const { random16BaseString, randomBinaryString } = require("../utils/random");

/**
 * @brief -> Login Route
 * 
 * @req body -> {name, pass}
 * 
 * @cmd - curl -X POST localhost:3000/cust/login -H "Content-Type: application/json" -d @data.json
 */
router.post('/login', (req, res) => {
    const { name, pass } = req.body;

    custModel.authenticate( name, pass )
                .then(() => {   // doc not required here
                    res.json({
                        token: jwt.sign({
                                    uid: name,  // no scopes for now
                               }, jwt_sec_token)
                    })
                })
                .catch(err => {
                    console.error(err.msg || err);

                    res.sendStatus( err.status || 500); // can be 401 too
                })
})

/**
 * @brief -> Sign Up Route
 * 
 * @req body -> {name, pass, contact}
 */
router.post('/sign_up', (req, res) => {

    const user = {
        name: req.body.name,
        pass: req.body.pass // this MUST be transported on secure network
    }

    if( isValidPhone(req.body.contact) ){
        user.mobile = parseInt( req.body.contact.split(' ').pop() );    // to remove initial +91, if any
    }else if( isValidEmail(req.body.contact) ) {
        user.email = req.body.contact;
    }else{
        return res.status(500).send({err: 'Contact invalid'});  // @todo -> Use correct status code for invalid data received
    }

    custModel.create( user, (err) => {  // doc not needed to use in callback
        if(err) {
            console.error(`(${err.code})Couldn't save user - `, user);
            return res.sendStatus(500);
        }

        res.sendStatus(204);    // done :D
    })

})

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
