const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const faker = require('faker');

// This is totally unnecessary for this app, we can store images on our local nodejs server
// const s3 = new aws.S3(
//         { 
//             accessKeyId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
// 			secretAccessKey: "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
//         }
// );


const checkJWT = require('../middlewares/check-jwt');

// metadata: function(req, file, cb) {
//     cb(null, { fieldName: file.fieldName });
// },

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'feramazonowebapplication',        
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString())
//         }
//     })
// });

var upload = multer({ dest: 'uploads/' });

router.route('/products')
    .get(checkJWT, async (req, res, next ) => {
        try {           
            const products = await Product.find({ owner: req.decoded.user._id })           
               .populate('owner')
               .populate('category')
               .exec();

            if (products)
               res.json({
                   success: true,
                   message: "Products",
                   products: products
               });

            /*
               Product.find({ owner: req.decoded.user_id })
                   .populate('owner')
                   .populate('categories')
                   .exec((err, products) => {
                      if (products) {                          
                          res.json({
                              success: true,
                              message: "Products",
                              products: products
                          });
                    })                
            */

        }
        catch (error) {
            next(error);
        }        
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        
        console.log(req.body);        
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;           
        product.image = 'http://localhost:3030/' + req.file.filename;
        // product.image = req.location.name;
        product.save();

        res.json({
            success: true,
            message: 'Successfully Added the product'
        });
    });

/* Just for testing */

router.get('/faker/test', (req, res, next) => {
    for (i = 0; i < 20; i++) {
        let product = new Product();
        product.category = "5b90ed85ee551f29bcb3cb23" ;
        product.owner = "5b8cdd4d59cbb1164485c1a4";
        product.image = faker.image.cats();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }

    res.json({
        message: 'Successfully added 20 pictures.'
    });
});


module.exports = router;