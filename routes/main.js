const router = require('express').Router();
// const async = require('async');
const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');

const checkJWT = require('../middlewares/check-jwt');

router.get('/products', async (req, res, next) => {
    // This handler lacks some validation, ex: validate page number
    const perPage = 10; 

    const page = req.query.page || 1 ;
    console.log('page: ', page);    

    try {
        const totalProducts = await Product.count({});

        const products = await Product.find({})
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate('category')
            .populate('owner')
            .exec();        

        res.json({
            success: true,
            message: 'category',
            products: products,            
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });

    } catch (error) {
        res.json({
            success: false,
            message: error['message']
        });
    }    
});

router.route('/categories')
    .get(async (req, res, next) => {
        try {
            const categories = await Category.find({});
            res.json({
                success: true,
                message: 'Successful',
                categories: categories
            });
        } catch (error) {
            next(error);
        }       
    })
    .post((req, res, next) => {
        const category = new Category();
        category.name = req.body.name;
        category.save();
        res.json({
            success: true,
            message: 'Successful'
        });
    });

router.get('/categories/:id', async (req, res, next) => {
    // This handler lacks some validation, ex: validate page number
    const perPage = 10; 

    const page = req.query.page || 1 ;
    console.log('page: ', page);

    // Product.find({ category: req.params.id })
    //     .populate('category')
    //     .exec((err, products) => {
    //         Product.count({ category: re.params.id }, (err, totalProducts) => {
    //             res.json({
    //                 success: true,
    //                 message: 'category',
    //                 products: products,
    //                 categoryName: products[0].category.name,
    //                 totalProducts: totalProducts,
    //                 pages: Math.ceil(totalProducs / perPage)
    //             });
    //         });
    //     });

    try {
        const totalProducts = await Product.count({ category: req.params.id });

        const products = await Product.find({ category: req.params.id })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate('category')
            .populate('owner')
            .exec();

        const category = await Category.findOne({ _id: req.params.id });

        res.json({
            success: true,
            message: 'category',
            products: products,
            categoryName: category.name,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });

    } catch (error) {
        res.json({
            success: false,
            message: error['message']
        });
    }    
});

router.get('/product/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        .populate('category')
        .populate('owner')
        .exec();

        if (!product) {
            return res.json({
                success: false,
                message: 'Product is not found' 
            });
        }
        res.json({
            success: true,
            product: product
        });
        
    } catch (err) {
        next(err);
    }    
});

router.post('/review', checkJWT, async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.body.productId });

        if(!product) return res.json({ success: false, message: 'No product found.'});

        const review = new Review();
        review.owner = req.decoded.user._id;

        if (req.body.title) review.title = req.body.title;
        if (req.body.description) review.title = req.body.description;

        review.rating = req.body.rating;

        product.reviews.push(review._id);
        // Meter una transaction
        product.save();
        review.save();

        res.json({
            sucess: true,
            message: 'Successfully added the review.'
        });
    } catch (error) {
        next(error['message']);
    }  
});

module.exports = router;