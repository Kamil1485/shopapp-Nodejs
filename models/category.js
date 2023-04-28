const mongoose=require("mongoose");
const Joi=require("joi");
const Schema = mongoose.Schema;//*Veritabnından id almak için kullanacağım-1
const categorySchema=mongoose.Schema({
    name:String,
    products: [//*amaç:one to many ilişkisi kurmak,bir category birden fazla blog içerebilir.-2
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      
})

function validateCategory(category) {
    const schema = new Joi.object({
        name: Joi.string().min(3).max(30).required(),
        products:Joi.array(),
        
    });

    return schema.validate(category);
}

// module.exports=mongoose.model("Category",categorySchema)//model aracılıgıyla metotlarla database islemleri basitleşecek
const Category=mongoose.model("Category",categorySchema)//model aracılıgıyla metotlarla database islemleri basitleşecek
module.exports={Category,validateCategory};
// const ctg1=new Category({
//     category:"mobile",
// })

// async function saveCategory(){
//     try{
//      const result=await ctg1.save();// tabloya ürün ekleme
//      console.log(result)
//     }
//     catch(err){
//      console.log(err)
//     }
//  }
//  saveCategory();
 
 