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

        const resultPerPage = 20;
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




// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });



// res.status();
// 200 To send responce to client without any data like data deleted
// 201 To send responce to client with data like data created
// 500 To send responce to client that any error occured like prduct not found