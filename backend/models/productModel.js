const mongoose = require("mongoose");

// Identifing all important data for product and making its model for data base
const productSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"]
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        maxLength:[8,"Price cannot exceed 8 charachters"]
    },
    rating:{
        type:Number,
        default:0
    },
    image:[
        {        
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    catagory:{
        type:String,
        required:[true,"Please Enter Product Catagory"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLength:[4,"Price cannot exceed 4 charachters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comments:{
                type:String,
                required:true,
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: true,
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("Product",productSchema);