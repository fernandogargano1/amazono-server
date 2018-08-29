const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = user.gravatar();
    user.isSeller = req.body.isSeller;

    User.findOne({ email: req.body.email}, (err, existingUser) => {
        if (existingUser) {
            res.json({
                success: false,
                message: 'Account with email already exists'
            });
        } else {
            user.save();            

            const token = jwt.sign({ user: user }, config.get('secret'), { expiresIn: '7d' });  

            res.json({
                success: true,
                message: 'Enjoy your token',
                token: token
            });            
        }    
    });
});

module.exports = router;