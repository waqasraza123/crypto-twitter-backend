const jwt = require("jsonwebtoken");

/**
 *
 * checks the token
 * verify it
 * attach the user to req object
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const jwtAuthentication = function (req, res, next){
    const reqHeader = req.headers["authorization"];
    const token = reqHeader && reqHeader.split(" ")[1];

    //token is not present
    if(token == null){
        return res.status(401).json({message: "UnAuthorized!"}); //not authorized
    }

    //else verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user){
        if(err){
            return res.status(403).json({message: "UnAuthorized!"}); //expired token or access revoked
        }

        //else attach the user to the req
        req.user = user;
        next(); //call the next middleware
    });
}


module.exports = jwtAuthentication;