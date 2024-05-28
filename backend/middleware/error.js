const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHander")

module.exports = (err,req,res,next)=>{
 err.statusCode = err.statusCode || 500;
 err.message = err.message || "Internal Server Error"

// Wrong Mongodb id Error
if(err.name ==="CasteError"){
   const message = `Resource not found, Invalid: ${err.path}`;
   err = new ErrorHandler(message, 400);
}

// Mongoose duplicate key error like rejister with same email
if(err.code === 11000){
   const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
   err = new ErrorHandler(message, 400);
}

// Wrong JWT error
if(err.name === "JsonWebTokenError"){
   const message = `Json Web Token is invalid , Try again!`;
   err = new ErrorHandler(message, 400);
}

// JWT expire error
if(err.name === "TokenExpiredError"){
   const message = `Json Web Token is Expired , Try again!`;
   err = new ErrorHandler(message, 400);
}



 res.status(err.statusCode).json({
    success:false,
    message:err.message,
 })
}