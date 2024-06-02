// Basic Setup for Routing with slash 
const express = require("express");
const router = express.Router();

// Importing function which you want to route & all function are created in controller and imports in routes
const { getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails, createProductReview, getProductReviews, deleteReview} = require("../controllers/producController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Giving Url and function, to provide source adrresss

router.route("/products").get(getAllProducts); 
router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin") , deleteProduct);
router.route("/products/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);


module.exports = router;    
