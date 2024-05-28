// Basic Setup for Routing with slash 
const express = require("express");
const router = express.Router();

// Importing function which you want to route & all function are created in controller and imports in routes
const { getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails} = require("../controllers/producController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Giving Url and function, to provide source adrresss

router.route("/products").get(getAllProducts); 
router.route("/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route("/products/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin") , deleteProduct).get(getProductDetails);
 

module.exports = router;
