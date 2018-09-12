const router = require('express').Router();
const Category = require('../models/category');

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

module.exports = router;