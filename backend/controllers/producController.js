const Product = require("../models/productModel")
const ErrorHander = require("../utils/errorHander")
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Apifeatures = require("../utils/apifeatures");


// Create a product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

// Get All products
    exports.getAllProducts = catchAsyncErrors(async (req, res) => {

        const resultPerPage = 5;
        const productCount  = await Product.countDocuments();


        const apiFeatures = new Apifeatures(Product.find(),req.query)
        .search().
        filter()
        .pagination(resultPerPage);
        const products = await apiFeatures.query;
        res.status(200).json(
            {
                success: true,
                products,
                productCount,
            }
        )
    })

// Update  Product --Admin
exports.updateProduct = catchAsyncErrors(async(req,res,next)=>{
    // If product not found  
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404))
    }
    // If Product Found
    
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidator:true,useFindAndModify:false});
    res.status(200).json(
        {
            success: true,
            product      
        })
    
})

// Delete Product
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHander("Product not found",404))
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
})

// Get product details or get single product

exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404))
    }
    // res.status(500).json({
    //     success:false,
    //     message:"Product not Found"
    // })
    res.status(200).json({
        success:true,
        product
    })
})



// res.status();
// 200 To send responce to client without any data like data deleted
// 201 To send responce to client with data like data created
// 500 To send responce to client that any error occured like prduct not found