const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3(
    { 
        accessKeyId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", 
        secretAccessKey: "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
    }
);

const checkJWT = require('../middlewares/check-jwt');

// metadata: function(req, file, cb) {
//     cb(null, { fieldName: file.fieldName });
// },

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'feramazonowebapplication',        
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

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
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();

        res.json({
            success: true,
            message: 'Successfully Added the product'
        });
    })


module.exports = router;