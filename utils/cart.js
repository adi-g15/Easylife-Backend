const sabjiModel = require("../models/schemas/sabji");

module.exports = {
    getCartTotal: function getCartTotal(sabji_list, areIds) {   // 2nd val is a boolean that tells if the passed array is just an array of ids; Else if it is left or false, then the array is considered to be an array of ovbjects
        return new Promise((resolve, reject) => {
            let isLast = false;
            const resultObj = {
                list: [],   // list of names
                total: 0
            }

            if( ! Array.isArray(sabji_list) ){
                return reject( new Error("Sabji List passed is not an array") );
            }

            if( areIds === true ){
                sabji_list.forEach((sabji_id, index) => {

                    sabjiModel.findOneById( sabji_id, 'name price', (err, doc) => {
                        if(err) {
                            // error
                            console.error(err);

                            return reject("500 SERVER ERROR");
                        }
                        else if( ! doc ){
                            console.log("Sabji Not Found");
                            return; // should return from the forEach too
                        }

                        resultObj.list.push( doc.name );
                        resultObj.total += doc.price ;
                    });

                    if( index === sabji_list.length ){  // if we have covered all the array elements, resolve the promise
                        return resolve( resultObj );
                    }
                });
            }
            else{
                // each element of the list will now be considered as a sabji object
                console.log("Getting whole array of sabji objects from client is not recommended, rather just have array of ids only, that's enough");

                sabji_list.forEach((sabjiObj, index) => {
                    sabjiModel.findOneById( sabjiObj.id, 'name price', (err, doc) => {
                        if(err) {
                            // error
                            console.error(err);
                            return reject("500 SERVER ERROR");
                        }
                        else if( ! doc ){
                            console.log("Sabji Not Found");
                            return;
                        }

                        resultObj.list.push( doc.name );
                        resultObj.total += doc.price ;
                    });

                    if( index === sabji_list.length ){  // if we have covered all the array elements, resolve the promise
                        return resolve( resultObj );
                    }
                });
            }

        });
    }
};
