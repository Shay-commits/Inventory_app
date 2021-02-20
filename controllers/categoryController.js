var Category = require('../models/category');
const Product = require('../models/product');
var async = require('async');
const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
require('dotenv').config()



// Display list of all Categories
exports.category_list = function(req,res) {

    Category.find({}).exec(function(err,category_list) {
        if (err) {return next (err)};
        res.render('category_list', {title: 'Category list', category_list})
      })

};

// Display detail page for a specific Category
exports.category_detail = function(req,res) {
    
    Product.find({category: req.params.id}).exec(function(err,products) {
        if (err) {return next (err)}
        res.render('category_detail', {title: 'Products', products}) 
    })

};

// Display Category create form on GET
exports.category_create_get = function(req,res) {

    res.render('category_form', {title: 'Create New Category'});


};

// Handle Category create on POST
exports.category_create_post = [ 
  
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

      // Need to check if name already exists 

      let category = new Category(
        {
          name: req.body.name,
          description: req.body.description,
          image: req.body.image
        
        });
  
      if (!errors.isEmpty()) {
          res.render('category_form');
      }   


      else {
          //Data form is valid
          //Check if Category with same name already exists
      Category.findOne({'name': req.body.name})
      .exec(function(err, found_category) {
         if (err) {return next(err);}

         if (found_category) {
           // Category exists, redirect to its detail page.
           res.redirect(found_category.url);
         }
         else {

           category.save(function (err) {
             if (err) {return next(err);}
             //Genre saved.Redirect to category detail page
             res.redirect(category.url);
           });

         }

      });
  
      }
  }
  
  ];

// Display Category delete form on GET
exports.category_delete_get = function(req,res) {

    Category.findById(req.params.id).exec(function(err,category) {
        if (err) {return next (err)}
        res.render('delete', {title: 'Delete Category', results: category})
      })

};

// Handle Category delete on POST
exports.category_delete_post = function(req,res) {

    if (req.body.password == process.env.DEL_PASS) {

        Category.findByIdAndDelete(req.params.id).exec(function (err, results) {
          if (err) {return next (err)}
          res.redirect('/')
        })
      }
    
      else {
        Category.findById(req.params.id).exec(function(err,category) {
          if (err) {return next (err)}
          res.render('delete', {title: 'Delete Category Failed, Wrong Password', results: category})
        })
    
      }

};

// Display Category update form on GET
exports.category_update_get = function(req,res) {

    Category.findById(req.params.id).exec(function(err,category) {
        if (err) {return next (err)}
        res.render('category_form', {title: 'Update Category', results: category})
      })



};

// Handle Category update on POST
exports.category_update_post = [
  //Validate fields
  body('name').isLength({min: 1}).trim().withMessage('name must be specified'),
  body('description').isLength({min: 1}).trim().withMessage('description must be at least 10 characters'),
  body('image').isLength({min: 1}).trim().withMessage('description must be at least 10 characters'),

  // Sanitize fields
  sanitizeBody('name').escape(),
  sanitizeBody('description').escape(),


  // Process request after validation and sanitization
  async (req,res,next) => {

    // Extract the validation errors from request
    const errors = validationResult(req);

    let category = new Category(
      {
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        _id: req.params.id
      
      });

    if (!errors.isEmpty()) {
        res.render('category_form');
    }   


    else {
        //Data form is valid
        //Check if Category with same name already exists
    Category.findOne({'name': req.body.name})
    .exec(function(err, found_category) {
       if (err) {return next(err);}

       if (found_category) {
         // Category exists, redirect to its detail page.
         res.redirect(found_category.url);
       }
       else {

         Category.findByIdAndUpdate(req.params.id, category, {}, function(err,results) {
           if (err) {return next (err)}
           // redirect to updated  category page 
           res.redirect(results.url)
         })

       }

    });

    }
}

];