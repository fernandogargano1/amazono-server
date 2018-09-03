const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // let token = req.headers["authorization"];
    let token = req.get('authorization'); // You can also call req.header('Authorization')    

    if (token) {        
        jwt.verify(token, config.get('secret'), function(err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failed to authenticate token'
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }    
}