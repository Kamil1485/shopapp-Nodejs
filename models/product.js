const mongoose=require("mongoose");
const Joi=require("joi");
//schema tanımlama -sql tablo gibi
//*2-olusturmak istedigin tablonun sütün özelliklerini tanımla
const Schema = mongoose.Schema;

//product yorumları için schema olustur.
//Cok gerekli degil amaç:Embeded documents ilişkisi kurma yani collection içinde collection saklamak.
//referans ve embeded doc ilişkisi aynı schemada kullanılabilir
const commentSchema=mongoose.Schema({//E1
    date:{
        type:Date,
        default:Date.now()
    },
    text:String,
    username:String,
    // user:{type:Schema.Types.ObjectId,ref:"User"}//referance ilişkisi
})

const productSchema=mongoose.Schema({
    name:String,
    price:String,
    description:String,
    imageUrl:String,
    date:{
        type:Date,
        default:Date.now()
    },
    isActive:Boolean,//ürünün aktif olup olmadıgın belirlemek
    //one to one ilişki kurduk 
    category:{type:Schema.Types.ObjectId,ref:"Category"},//type category _id degeri //2
    //ref, Category modelinden _id degeri alınacak
    //*Embeded Documents ilişkisi
    comments:[commentSchema]//E2
})
//*3-Hangi colllections da bir tablo olusturacagına karar ver
//prodcut modeli  

function validateProduct(product) {
    const schema = new Joi.object({
        name: Joi.string().min(3).max(30).required(),
        price: Joi.number().required(),
        description:Joi.string(),
        imageUrl:Joi.string(),
        isActive:Joi.boolean(),
        category:Joi.string(),
        comments:Joi.array(),
        // user:Joi.array(),
    });

    return schema.validate(product);
}

// module.exports=mongoose.model("Product",productSchema)//model aracılıgıyla metotlarla database islemleri basitleşecek
const Product=mongoose.model("Product",productSchema);//Product isimli ve prodcutSchema özelliklerine sahip tablo olustur.
const Comment=mongoose.model("Comment",commentSchema);
module.exports={Product,Comment,validateProduct}

/*
//tabloya veri ekleme 
const prd1=new Product({
    name:"İphone 18",
    price:4000,
    description:"iphone telefon",
    imageUrl:"1.jpeg",
    isActive:true,
})
async function saveProduct(){
   try{
    const result=await prd1.save();//product 1
    console.log(result)
   }
   catch(err){
    console.log(err)
   }
}
saveProduct();


*/