var express = require('express');
var router = express.Router();

// Require controller models
var product_controller = require('../controllers/productController');
var category_controller = require('../controllers/categoryController');
var product_instance_controller = require('../controllers/productinstanceController');


// HOME PAGE
router.get('/', product_controller.index);

// PRODUCT ROUTES

// GET request for creating Product
router.get('/product/create', product_controller.product_create_get);

// POST request for creating Product
router.post('/product/create', product_controller.product_create_post);

// GET request to delete Product.
router.get('/product/:id/delete', product_controller.product_delete_get);

// POST request to delete Product.
router.post('/product/:id/delete', product_controller.product_delete_post);

// GET request to update Product.
router.get('/product/:id/update', product_controller.product_update_get);

// POST request to update Product.
router.post('/product/:id/update', product_controller.product_update_post);

// GET request for one Product .
router.get('/product/:id', product_controller.product_detail);

// GET request for list of all Product items.
router.get('/products', product_controller.product_list);

// CATEGORY ROUTES

// GET request for creating category
router.get('/category/create', category_controller.category_create_get);

// POST request for creating category
router.post('/category/create', category_controller.category_create_post);

// GET request to delete category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one category .
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all category items.
router.get('/categories', category_controller.category_list);



// PRODUCT INSTANCE

// GET request for creating productinstance
router.get('/productinstance/create', product_instance_controller.productinstance_create_get);

// POST request for creating productinstance
router.post('/productinstance/create', product_instance_controller.productinstance_create_post);

// GET request to delete productinstance.
router.get('/productinstance/:id/delete', product_instance_controller.productinstance_delete_get);

// POST request to delete productinstance.
router.post('/productinstance/:id/delete', product_instance_controller.productinstance_delete_post);

// GET request to update productinstance.
router.get('/productinstance/:id/update', product_instance_controller.productinstance_update_get);

// POST request to update productinstance.
router.post('/productinstance/:id/update', product_instance_controller.productinstance_update_post);

// GET request for one productinstance .
router.get('/productinstance/:id', product_instance_controller.productinstance_detail);

// GET request for list of all productinstance items.
router.get('/productinstances', product_instance_controller.productinstance_list);


module.exports =router ;
