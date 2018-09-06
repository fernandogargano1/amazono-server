const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');
// const bcrypt = require('bcrypt-nodejs');
const checkJWT = require('../middlewares/check-jwt');

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

router.route('/profile')
    // .get(checkJwt, (req, res, next) => {
    //     User.findOne({_id: req.decoded.user._id}, (err, user) => {
    //         res.json({
    //             success: true, 
    //             user: user,
    //             message: "Successful"
    //         });
    //     });
    // })
    .get(checkJWT, async (req, res, next) => {

        try {
            const user = await User.findOne({_id: req.decoded.user._id});

            if (user) {
                res.json(
                    {
                        success: true, 
                        user: user,
                        message: "Successful"
                    }
                );
            } else {
                res.json({
                    success: false,
                    message: 'User not found'
                });
            }            
        } catch (err) {
            next(err);
        }                
    })
    .post(checkJWT, async (req, res, next) => {

        try {
            const user = await User.findOne({ _id: req.decoded.user._id});

            if (!user) return next();

            if(req.body.name) user.name = req.body.name;
            if (req.body.email) user.email = req.body.email;
            if (req.body.password) user.password = req.body.password;

            user.isSeller = req.body.isSeller;

            await user.save();

            res.json({
                success: true,
                message: 'Successfully edited your profile'
            });
        } catch (err) {
            next(err);
        }
    });

router.route('/address')    
    .get(checkJWT, async (req, res, next) => {

        try {
            const user = await User.findOne({_id: req.decoded.user._id});

            if (user) {
                res.json(
                    {
                        success: true, 
                        address: user.address,
                        message: "Successful"
                    }
                );
            } else {
                res.json({
                    success: false,
                    message: 'User not found'
                });
            }            
        } catch (err) {
            next(err);
        }        
    })
    .post(checkJWT, async (req, res, next) => {
        try {
            const user = await User.findOne({ _id: req.decoded.user._id});

            if (user) {
                if (req.body.addr1) user.address.addr1 = req.body.addr1
                if (req.body.addr2) user.address.addr2 = req.body.addr2
                if (req.body.city) user.address.city = req.body.city
                if (req.body.state) user.address.state = req.body.state
                if (req.body.country) user.address.country = req.body.country
                if (req.body.postalCode) user.address.postalCode = req.body.postalCode;

                await user.save();

                res.json({
                    success: true,
                    message: 'Successfully edited your address'
                });
            } else {
                res.json({
                    success: false,
                    message: 'User not found'
                });
            }            
        } catch (err) {
                next(err);
        }
    });

module.exports = router;