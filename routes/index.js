'use strict';

require('express-router-group');
const express = require('express');
const router = express.Router();
const { passportAuthenticateJWT } = require('../utils/jwt.util')

const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const cartController = require("../controllers/cart.controller");
const listController = require("../controllers/list.controller");
const quoteController = require("../controllers/quote.controller");
const keepstockController = require("../controllers/keepstock.controller");
const productController = require("../controllers/product.controller");
const bulkDataController = require("../controllers/bulkData.controller");

const contextPath = "/api"

function getErrorMessage(err) {
    if (typeof err == 'string') return err
    return (typeof err === 'object' ? err.message || err.toString() : "Request processed with error")
}

express.response.sendWrapped = function (err, data, message = "Request processed successfully") {
    let finalResponse = {
        status: !err,
        message: err ? getErrorMessage(err) : message,
        data: data
    }
    this.send(finalResponse);
}

console.log('contextPath', contextPath)

router.group(`/${contextPath}`, router => {

    router.group("/auth", router => {

        router.post('/redirect-to', authController.redirectToAuth);
        router.post('/refresh-token', authController.refreshToken);
    })

    router.group("/user", router => {

        router.get('/profile', userController.profile);
        router.get('/permissions', userController.permissions);
        router.post('/update-profile', userController.updateProfile);
        router.post('/update-setting', userController.updateSetting);
        router.post('/change-password', userController.changePassword);
     
        
    })

    router.group("/product", passportAuthenticateJWT((req, res, next) => next()), router => {

        router.post('/list', productController.products);
        router.post('/brands', productController.brands);
        router.post('/search', productController.search);
        router.get('/get-product/:id', productController.get);
        router.get('/categories', productController.categories);
        router.get('/breadcrumb/:id', productController.breadbrumb);
        router.get('/get-max-price', productController.getMaxPrice);
        router.post('/product-category', productController.productCategory);
        router.get('/sub-categories/:type/:id', productController.subcategories);
        router.post('/alternate-product/:id', productController.alternateProduct);
    })

    router.group("/fav-list", passportAuthenticateJWT((req, res, next) => next()), router => {

        router.post('/create-list', listController.createList);
        router.get('/lists', listController.getLists);
        router.delete('/lists/:id', listController.deleteListById);
        router.post('/product-delete', listController.deleteProductFromList);
        router.get('/get/:id', listController.getProducts);
        router.post('/add-to-cart/:id', listController.addToCart);
        router.post('/import/:id', listController.importBulkProducts);
        router.post('/product-update', listController.updateProductsInList);
    })

    router.group("/cart", passportAuthenticateJWT((req, res, next) => next()), router => {

        router.get('/list', cartController.list);
        router.post('/add-to-cart', cartController.create);
        router.post('/cart-detail-mail', cartController.cartDetailMail);
        router.post('/bulk-order', cartController.bulkOrder);
        router.delete('/delete/:id', cartController.destory);
    })

    router.group("/quote", passportAuthenticateJWT((req, res, next) => next()), router => {

        router.post('/list', quoteController.list);
        router.get('/get/:id', quoteController.get);
        router.post('/request', quoteController.request);
        router.get('/cart/:id', quoteController.getQuote2cart);
        router.post('/add-to-cart/:id', quoteController.addtoCart);
    })

    router.group("/keepstock", passportAuthenticateJWT((req, res, next) => next()), router => {

        router.get('/search/:id', keepstockController.search);
        router.post('/update/:id', keepstockController.update);
        router.post('/delete-item/:id', keepstockController.deleteItem);
    })

    // router.group("/bulk", passportAuthenticateJWT((req, res, next) => next()), router => {
        
    // })
    
    
    //     app.get('/bulk-data', bulkDataController.getDynamicData);
  
   
})

router.group("/bulk",router => {
    console.log('router', router);
    router.post("/insert", bulkDataController.bulkData);
});

module.exports = router;