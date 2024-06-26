const User = require("../models/userModel")
const ErrorHander = require("../utils/errorHander")
const catchAsyncErrors = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a user
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl"

        }
    });

  // REPLACE BY UTILS
    //     const token = user.getJWTToken();
    // res.status(200).json({
    //     success:true,
    //     token,
    // });

    sendToken(user,201,res);

})


// Login User
exports.loginUser = catchAsyncErrors(
    async (req,res,next)=>{
        const {email, password} = req.body;

        // checking if user have given email and password both through input

        if(!email || !password){
            return next(new ErrorHander("Please Enter Email and Password"),400);
        }

        const user = await  User.findOne({email}).select("+password");

        if(!user){
            return next(new ErrorHander("Invalid Email and Password"),401);
        }
    
        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched){
            return next(new ErrorHander("Invalid Email and Password"),401);
        }


        sendToken(user,201,res)
    // REPLACE BY UTILS Send Token
    //     const token = user.getJWTToken();
    // res.status(200).json({
    //     success:true,
    //     token,
    // });
    }
)



// Logout User
exports.logout = catchAsyncErrors(
    async (req,res,next)=>{
    
    res.cookie("token",null,{
        expires: new Date( Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success:true,
        message:"Logged Out",
    });
    }
)


// Forget Password
exports.forgetPassword = catchAsyncErrors(
    async (req,res,next)=>{

        const user = await User.findOne({email : req.body.email});

        if(!user){
            return next(new ErrorHander("User not found"),404);
        }

        const  resetToken = user.getResetPasswordToken();

        // to save new generated hash value in user Schema
        await user.save({validateBeforeSave : false});

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

        const message =`Your password reset Token is :- \n\n ${resetPasswordUrl}\n\n If you not have requested this email then,  please ignore it`;
        
        try {

            await sendEmail({
                email:user.email,
                subject:`Ecommerce Password Recovery`,
                message,
            });

            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email} successfully`,
            })
            
        } catch (error) {
            resetPasswordToken = undefined,
            resetPasswordExpire = undefined,

            await user.save({validateBeforeSave : false});

            return next(new ErrorHander(error.message),500);
        }

    }
)


// Reset password
exports.resetPassword = catchAsyncErrors(
    async (req,res,next)=>{
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire : {$gt: Date.now()}
        });

        if(!user){
            return next(new ErrorHander("Reset Password is invalid or has ben expired"),400);
        }
        
        if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorHander("Password does not matched"),400);
        }

        user.password = req.body.password,
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined,

        await user.save();

        sendToken(user, 200, res)
    }
);



// Get user(yourself who is currently login) Details

exports.getUserDetail= catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

// update user password

exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

        if(!isPasswordMatched){
            return next(new ErrorHander("Old Password is inncorrect"),400);
        }

        if(req.body.newPassword !== req.body.confirmPassword){
            return next(new ErrorHander("Password does not matched"),400);
        }

        user.password = req.body.newPassword;

        user.save();

        sendToken(user,201,res)
})




// update user Profile

exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    // we will clouldinary later

    const user = await User.findByIdAndUpdate(req.user.id , newUserData , {
        new:true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
            success:true,
        });

})


//  Get all Users details(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });


 //  Get Single User details(admin) 
 exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHander(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });



// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Delete User --Admin
  exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
   
    await user.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });