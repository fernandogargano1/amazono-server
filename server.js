const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('config'); 
const cors = require('cors');

const app = express();
let port;

mongoose.connect("mongodb://localhost/amazonowebapplication", { useNewUrlParser: true })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
    

// if (config.has('port')) {
//     port = "3030";
// } 

port = config.get('port');

/* 
    the line below set up middleware equivalent to say:

    app.use(body-parser.json());
    app.use(body-parse.urlencoded({extended: false}));

    extented = false because in the future we want to read an image (?) as well
    You can red all sort of data types

 */ 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(cors());

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/account');
const sellerRoutes = require('./routes/seller');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);





app.listen(port, (err) => {
    console.log(`Magic happens on port awesome ${port}`);
});