const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHander");
const catchAsynError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsynError(
    async(req,res,next)=>{
        const {token} = req.cookies;

        if(!token) {
            return next(new ErrorHandler("Please Login to access this resource",401));
        }

        const decodedData = jwt.verify(token , process.env.JWT_SECRET);

        req.user = await User.findById(decodedData.id);

        next();
    }
);

exports.authorizeRoles = (...roles)=>{
    // another function to return response because in parameter we have to give both arguments and req,res, next thats why we use finction in function
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            next (new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resources`),403);
        }
        next();
    };
}