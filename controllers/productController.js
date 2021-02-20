require('dotenv').config();
var Product = require('../models/product');
var Category = require('../models/category');
var Productinstance = require('../models/productinstance');
var async = require('async');
const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
require('dotenv').config()

// HOme page
exports.index = function(req,res) {

async.parallel({

  product_count: function(callback) {
    Product.countDocuments({}, callback); // Empty argument passed as match condition to return all results
  },
  category_count: function(callback) {
    Category.countDocuments({}, callback);
  },
  product_instance: function(callback) {
    Productinstance.countDocuments({}, callback);
  }




}, function(err,results) {
     res.render('index', {title: 'Inventory Web App', error: err, data: results })
})



}

// Display list of all Products
exports.product_list = function(req,res) {

  Product.find({}).populate('category').exec(function(err,product_list) {
    if (err) {return next (err)};
    res.render('category_detail', {title: 'Product list', products : product_list})
  })

};

// Display detail page for a specific Product
exports.product_detail = function(req, res) {

  Productinstance.find({product: req.params.id}).populate({path:'product', populate: {path: 'category'}}).exec(function(err,product) {
    if (err) {return next (err)}
    console.log(product)
    res.render('stock_instance_list', {title: 'Product instance', results:product})
  })

}
// Display Product create form on GET
exports.product_create_get = function(req, res) {
  Category.find({},'name').exec(function(err,results) {
    if (err) {return next (err)}

    res.render('create_product', { title: 'Create New Product',categories: results});
  })
  
};

// Handle Product create on POST

exports.product_create_post = [ 
  
  //Validate fields
body('name').isLength({min: 1}).trim().withMessage('name must be specified'),
body('description').isLength({min: 1}).trim().withMessage('description must be at least 10 characters'),

// Sanitize fields
sanitizeBody('name').escape(),
sanitizeBody('description').escape(),


// Process request after validation and sanitization
 async (req,res,next) => {

    // Extract the validation errors from request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log('npt safe')
        //There are errors. Render form again with sanitized values/errors messages.
        Category.find({},'name').exec(function(err,results) {
          if (err) {return next (err)} 
          console.log(errors)
          res.render('create_product', {title: 'Create New Product', categories: results, errors: errors.array()});
          
          })
          return
          
        }
    else {
        // Data form is valid
        // capture category selection and return category id
        const category = await Category.findOne({'name': req.body.category},'id').exec()
        console.log(req.body.category)
        console.log(category);

        //Create a new product
        var product = new Product(
          {
            name: req.body.name,
            description: req.body.description,
            price:req.body.price,
            category: req.body.category,
            image: req.body.image
          
          });
          console.log(req.body.category)
        product.save(function (err) {
            if (err) {return next (err);}
            // Succesful - redirect to new author record
            res.redirect('/directory');
        });

    }
}

];


// Display Product delete form on GET
exports.product_delete_get = function(req, res) {

  Product.findById(req.params.id).exec(function(err,product) {
    if (err) {return next (err)}
    res.render('delete', {title: 'Delete Product', results: product})
  })

};

// Handle Product delete on POST
exports.product_delete_post = function(req, res) {

  if (req.body.password == process.env.DEL_PASS) {

    Product.findByIdAndDelete(req.params.id).exec(function (err, results) {
      if (err) {return next (err)}
      res.redirect('/')
    })
  }

  else {
    Product.findById(req.params.id).exec(function(err,product) {
      if (err) {return next (err)}
      res.render('product_delete', {title: 'Delete Product Failed, Wrong Password', product})
    })

  }

  

};

// Display Product update form on GET
exports.product_update_get = function(req, res) {


  async.parallel({
    product: function(callback) {
      Product.findById(req.params.id).populate('category').exec(callback)
    },
    categories: function(callback) {
      Category.find(callback)
    }

  }, function(err,results) {
    if (err) {return next (err)}
    if (results.product == null) {
      var err = new Error('Product not found');
      err.status = 404;
      console.log('product not found')
      return next (err)
    }

    //Mark selected categories
    for (i=0; i< results.categories.length; i++) {
      if (results.categories[i].toString() == results.product.category.toString()) {
        results.categories[i].checked = 'true';
      }
    }
    res.render('product_update', {title: 'Update Product', product: results.product, categories: results.categories})


  })



};

// Handle Product update on POST
exports.product_update_post = [
  
  
  //Validate fields
body('name').isLength({min: 1}).trim().withMessage('name must be specified'),
body('description').isLength({min: 1}).trim().withMessage('description must be at least 10 characters'),

// Sanitize fields
sanitizeBody('name').escape(),
sanitizeBody('description').escape(),


// Process request after validation and sanitization
 async (req,res,next) => {

    // Extract the validation errors from request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      
        //There are errors. Render form again with sanitized values/errors messages.
        async.parallel({
          product: function(callback) {
            Product.findById(req.params.id).populate('category').exec(callback)
          },
          categories: function(callback) {
            Category.find(callback)
          }
      
        }, function(err,results) {
          if (err) {return next (err)}
          
          //Mark selected categories
          for (i=0; i< results.categories.length; i++) {
            if (results.categories[i].toString() == results.product.category.toString()) {
              results.categories[i].checked = 'true';
            }
          }
          res.render('product_update', {title: 'Update Product', product: results.product, categories: results.categories})
      
      
        })
          return
          
        }
    else {
        // Data form is valid
        // capture category selection and return category id
        let categoryid = ""

        for (i=0; i < req.body.category.length; i++) {
          if (req.body.category[i].checked == 'true') {
            categoryid = req.body.category[i].id
          }
        }

        //Create a new product
        var product = new Product(
          {
            name: req.body.name,
            description: req.body.description,
            price:req.body.price,
            category: req.body.category,
            _id: req.params.id
          
          });
          


        Product.findByIdAndUpdate(req.params.id, product, {}, function (err,theproduct) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(theproduct.url);
                });

    }
}
]



