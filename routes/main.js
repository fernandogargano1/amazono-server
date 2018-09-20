const router = require('express').Router();
const async = require('async');
const Category = require('../models/category');
const Product = require('../models/product');
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

module.exports = router;