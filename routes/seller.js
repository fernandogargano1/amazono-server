const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3(
    { 
        accessKeyId: "AKIAIPNUVIKWUMM77N6A", 
        secretAccessKey: "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"
    }
);

module.exports = router;