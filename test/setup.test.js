process.env.NODE_ENV = 'test'

const Product = require('../models/product')
const User = require('../models/user')

//clean up database for testing
before((done) =>{
    Product.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

//clean up database after testing
after((done) =>{
    Product.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});