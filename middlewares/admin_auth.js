// const normal_auth = require("./auth");  // try to do use it without doing the same again, but if it's taking time, LEAVE IT, JUST COPY PASTE AND ADD WHAT OTHER NEEDED

module.exports = (req, res, next) => {
    // next(); // @todo -> Add when implemented scopes

    res.sendStatus(403);
}
