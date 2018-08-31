const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt-nodejs');

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

router.post('/login', (req, res, next) => {    
    User.findOne({ email: req.body.email }, function (err, user) {      
        if (err) throw err;

        if (!user) {           
            res.json({
                success: false, 
                message: 'Authentication failed. User not found'
            });
        } else if (user) {           
            const validPassword = user.comparePassword(req.body.password);      
           
            if (!validPassword) {               
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password'
                });
            }
            else {          
                console.log('valid password') 
                const token = jwt.sign({ user: user }, config.get('secret'), { expiresIn: '7d' });

                res.json({
                    success: true,
                    message: 'Enjoy your token',
                    token: token 
                });
            }   
        } 
    });
});

module.exports = router;