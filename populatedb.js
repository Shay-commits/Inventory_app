#! /usr/bin/env node

console.log('This script populates some test categories, products and productinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

var async = require('async')
var Product = require('./models/product')
var Category = require('./models/category')
var Stockinstance = require('./models/stockinstance')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = []
var categories = []
var stockinstances = []

function categoryCreate(name, description, cb) {
  categorydetail = {name: name, description: description};

  var category = new Category(categorydetail);

  category.save(function (err) {
    if (err) {
      cb(err,null)
      return
    }
    console.log('New Category:' + category);
    categories.push(category)
    cb(null, category)
  });

}

function productCreate(name,price,description, category, cb) {
  productdetail = {name: name, price: price,description: description, category: category }

  var product = new Product(productdetail);

  product.save(function(err) {
    if (err) {
      cb(err,null)
      return
    }
    console.log('New Product: ' + product);
    products.push(product)
    cb(null, product)
  });
}



function stockinstanceCreate(product,size,colour,cb) {
  stockinstancedetail = {product: product,size: size,colour:colour}

  var stockinstance = new Stockinstance(stockinstancedetail);

  stockinstance.save(function(err) {
    if (err) {
      cb(err,null)
      return
    }
    console.log('New Stockinstance:' + stockinstance);
    stockinstances.push(stockinstance)
    cb(null, stockinstance)
  });

}


function createCategories(cb) {
  async.series([
      function(callback) {
        categoryCreate('Shoulder Bags','Take all your essentials with you on the go',callback)
      },
      function(callback) {
        categoryCreate('Crossbody Bags','Take all your essentials with you on the go',callback)
      },
      function(callback) {
        categoryCreate('Clutch Bags','Take all your essentials with you on the go',callback)
      },
      function(callback) {
        categoryCreate('Backpacks','Take all your essentials with you on the go',callback)
      },
      function(callback) {
        categoryCreate('Wallets','Store all your credit and loyalty cards',callback)
      },
      function(callback) {
        categoryCreate('Phone Holders','Never pay for another screen repair',callback)
      },
    ], cb);


}

function createProducts(cb) {
    async.parallel([
        function (callback) {
          productCreate('Arya Backpack','105','Timeless backpack, suitable for all seasons',categories[3],callback)
        },
        function(callback) {
          productCreate('Card holder','40','Slim thick',categories[4],callback)
        },
        function(callback) {
          productCreate('Sling holder','35','Stylish and secure',categories[5],callback)
        },

    ],cb);
}

function createStockinstances(cb) {
    async.parallel([
       function(callback) {
         stockinstanceCreate(products[0],'S','black',callback)
       },
       function(callback) {
         stockinstanceCreate(products[0],'S','merlot',callback)
       },
       function(callback) {
         stockinstanceCreate(products[0],'S','navy',callback)
       },
       function(callback) {
         stockinstanceCreate(products[1],'S','black',callback)
       },
       function(callback) {
         stockinstanceCreate(products[1],'S','navy',callback)
       },
       function(callback) {
         stockinstanceCreate(products[2],'S','red',callback)
       },
       function(callback) {
         stockinstanceCreate(products[2],'S','black',callback)
       },
    ],cb);
}

async.series([
  createCategories,
  createProducts,
  createStockinstances
],
// Optional callback
function(err,results) {
  if (err) {
    console.log('FINAL ERR: '+err)

  }
  else {
    console.log('STOCKInstances: ' +stockinstances);
  }
  // All done, disconnect from database
  mongoose.connection.close();
})
