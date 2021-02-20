var ProductInstance = require('../models/productinstance')
var Product = require('../models/product')
var async = require('async');
const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
require('dotenv').config()


// Display list of all Product instance
exports.productinstance_list = function(req,res) {

    ProductInstance.find().populate({path:'product', populate: {path: 'category'}}).exec(function(err,results) {
        if (err) {return next (err)}

        res.render('stock_instance_list',{title: 'Product Instances', results } )
    })

};


// Display detail page for a specific Product instance
exports.productinstance_detail = function(req,res) {

    ProductInstance.find({product: req.params.id}).populate('name').exec(function(err,results) {
        if (err) {return next (err)}

        res.render('stock_instance_list',{title: 'Product Instances', results } )
    })

};
// Display Product instance create form on GET
exports.productinstance_create_get = function(req,res) {

    Product.find({},'name')
      .exec(function(err,products) {
         if (err) {return next (err); }
         // Successful, so render.
         res.render('stock_instance_form', {title: 'Create ProductInstance', product_list: products})
      })

};
// Handle Product instance create on POST
exports.productinstance_create_post = [
    // Validate fields
  body('product', 'Product must be specified').isLength({ min: 1}).trim(),
  body('colour', 'Colour must be specified').isLength({ min: 1}).trim(),
  

  // Sanitize fields.
  sanitizeBody('product').escape(),
  sanitizeBody('colour').escape(),
  sanitizeBody('size').trim().escape(),

     //Process request after validation and sanitization
  (req, res, next) => {

    //Extract validation errors from request
    const errors = validationResult(req) || [];

    ProductInstance.find({'product': req.body.product}).populate('product').exec(function(err,products) {

        if (!errors.isEmpty()) {
            //There are errors, Render form again with sanitized values and error messages
            Product.find({},'name')
            .exec(function(err,products) {
               if (err) {return next (err); }
               // Successful, so render.
               res.render('stock_instance_form', {title: 'Create ProductInstance', product_list: products, selected_product: productinstance.product_id, errors: errors.array(), productinstance: productinstance})
            })
              return;
        }

        if (err) {return next (err); }

        if (products) {

          for(i=0; i < products.length; i++) {
             if (products[i].size.toLowerCase() == req.body.size.toLowerCase() && products[i].colour.toLowerCase() == req.body.colour.toLowerCase()) {
                 errors["errors"].push('product instance already exists')
                 Product.find({},'name').exec(function(err,product) {
                   if (err) {return next (err); }
                   // Product exists, re-render form.
                   res.render('stock_instance_form', {title: `Size: ${products[i].size} and Colour: ${products[i].colour} of ${products[i].product.name} already exists `, product_list: product})
                 })
               return 
            }
          }
        }

         else {


            //Create a ProductInstance object with escaped and trimmed data
        var productinstance = new ProductInstance(
            { product: req.body.product,
              size: req.body.size,
              colour: req.body.colour,
              stock: req.body.stock
           });
    
    
    
    
          // Data form is valid.
          productinstance.save(function (err) {
            if (err) {return next (err);}
              //Successful - redirect to new record
              res.redirect(productinstance.url);
          });
        }
        

      })


  }
]
// Display Product instance delete form on GET
exports.productinstance_delete_get = function(req,res) {

    ProductInstance.findById(req.params.id).exec(function(err,category) {
        console.log(err)
        if (err) {return next (err)}
        res.render('delete', {title: 'Delete Product Instance', results: category})
      })

};
// Handle Product instance delete on POST
exports.productinstance_delete_post = function(req,res) {
    
    if (req.body.password == process.env.DEL_PASS) {

        ProductInstance.findByIdAndDelete(req.params.id).exec(function (err, results) {
          if (err) {return next (err)}
          res.redirect('/')
        })
      }
    
      else {
        ProductInstance.findById(req.params.id).exec(function(err,category) {
          if (err) {return next (err)}
          res.render('delete', {title: 'Delete Product Instance Failed, Wrong Password', results: category})
        })
    
      }
};
// Display Product instance update form on GET
exports.productinstance_update_get = function(req,res) {



    async.parallel({
        productinstance: function(callback) {
            ProductInstance.findById(req.params.id).populate('product').exec(callback)

        },
        products: function(callback) {Product.find({},'name')
        .exec(callback)

        }
    },
    function(err,results) {
         if (err) {return next (err); }
         // Successful, so render.
         console.log(results.productinstance)
         res.render('stock_instance_form', {title: `Update ${results.productinstance.product.name} `, product_list: results.products, productinstance: results.productinstance })
      })

};

// Handle Product instance update on POST
exports.productinstance_update_post = [
    // Validate fields
  body('product', 'Product must be specified').isLength({ min: 1}).trim(),
  body('colour', 'Colour must be specified').isLength({ min: 1}).trim(),
  body('stock', 'Number must be speciifed ').isNumeric(),
  

  // Sanitize fields.
  sanitizeBody('product').escape(),
  sanitizeBody('colour').escape(),
  sanitizeBody('size').trim().escape(),

     //Process request after validation and sanitization
  (req, res, next) => {

    //Extract validation errors from request
    const errors = validationResult(req)

        if (!errors.isEmpty()) {
            //There are errors, Render form again with sanitized values and error messages
            Product.find({},'name')
            .exec(function(err,products) {
               if (err) {return next (err); }
               // Successful, so render.
               res.render('stock_instance_form', {title: 'Create ProductInstance', product_list: products, selected_product: productinstance.product_id, errors: errors.array(), productinstance: productinstance})
            })
              return;
        }


        else {

            ProductInstance.findById(req.params.id).exec(function(err,products) {

                if (err) {return next (err)}

                //Create a ProductInstance object with escaped and trimmed data
               var productinstance = new ProductInstance(
                 { product: products.product,
                   size: products.size,
                   colour: products.colour,
                  stock: req.body.stock,
                  _id: req.params.id
           });

              // Data form is valid.
              ProductInstance.findByIdAndUpdate(req.params.id, productinstance, {}, function(err,newinstance) {
               if (err) {return next (err) }
               res.redirect('/') 
              })
            })
     }
 }

]