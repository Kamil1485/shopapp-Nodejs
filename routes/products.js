require("express-async-errors")//app ve expressden önce eklenmeli
const express = require("express");
const router = express.Router();
const Joi = require("joi");

//*4
const { Product, Comment, validateProduct } = require("../models/product");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { Category } = require("../models/category");
//eq=equal
//ne=not equal
//gt=grater than
//gte=grater than or equal
//lt=less than
//lte=less than or eqaul
//in=[1,2,3,4] 1,2,3,4 olan id leri getir mesela
//nin=[1,2,3] verlienlern harıcındekileri getirir mesela 10 ,5 vb

router.get("/", async (req, res,next) => {

  //const products= await Product.find();//tüm ürünleri getirir parametre vermediğin için.
  //const products= await Product.find({price:{$gt:5000}});    //fiyatı 5000 den büyük ürünleri getirir
  // const products= await Product.find({isActive:true}).select({name:1,price:1});    //isActive değeri true olan ürünlerin sadece name ve price değerlerini getirir diğerleri gelmez.
  //const products = await Product.find({ price: { $gte: 4000, $lte: 5000 } }); //fiyatı 4000-5000 dahil arasındaki ürünler
  //const products = await Product.find({ price: { $in: [4000, 6000] } }); //fiyatı tam olarak:4000 veya  6000 olanlar gelir
  //const products = await Product.find().or([{price:{$gt:5000}},{isActive:false}]);//fiyatı 5000 den fazla olanları veya active değerleri false olanları getirir.
  /*
  const products = await Product.find().or([
    { $and: [{ price: { $gt: 5000 } }, { name: "Galaxy S21" }] },
    { isActive: false }
  ]);//fiyatı 5000 den fazla ve(and) ismi Galaxy S21 veya(or) isActive:true olan değeri getirir  
  
*/
  //startwith
  // const products = await Product.find().or([{price:{$gt:5000},name:"Galaxy S21"},{isActive:true}]);//fiyatı 5000 den fazla olanları veya active değerleri false olanları getirir.
  // const products = await Product.find({name:/^iphone/ })//startswith iphone ile başlar sonu önemsizleri döndürür.
  // const products = await Product.find({name:/iphone$/ })//endwith, sonu iphone ile bitenleri döndürür.
  //const products = await Product.find({name:/.*iphone.*/ })//contains, name içinde iphone geçenleri döndürür.
  // const products = await Product.find().populate('category',"name -_id").select("-isActive");//category in sadece name alanını ve productında isactive alanı hariç bölümler gelir.
  //.populate({path:"comments",populate:{path:"user"}})
  const products = await Product.find().populate("category", "name -_id"); //comments  üzerinden populate i cagır  ve  user propunun verilerini al .select("-isActive");
  res.send(products);
});

router.get("/create", async (req, res) => {
  try {
    const products = await Product.find();
    const categories = await Category.find();
    res.render("../views/product-create.ejs", {
      categories: categories,
      products: products,
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/create", async (req, res) => {
  req.header = "x-auth-token";
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  console.log(req.body.isActive)

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    isActive: req.body.isActive,
    imageUrl: req.body.imageUrl,
  });
  try {
    const result = await product.save(); //product 1
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  req.header = "x-auth-token";
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // const product = {
  //     id: products.length + 1,
  //     name: req.body.name,
  //     price: req.body.price
  // };

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    isActive: req.body.isActive,
    category: req.body.category,
    comments: [],
  });

  // products.push(product);
  try {
    const result = await product.save(); //product 1
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.put("/comment/:id", auth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  const comment = new Comment({
    text: req.body.text,
    username: req.body.username,
  });
  product.comments.push(comment);
  const updatedProduct = await product.save(); //product 1
  res.send(updatedProduct);
});

router.put("/:id", auth, async (req, res) => {
  /* //1.yöntem
   const product = products.find((p) => p.id == req.params.id);   
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }

  const { error } = validateProduct(req.body); //req.body product iceriyor aslında prodcut verilerinin hepsini içerdiği için kontrolü  yapmış oluyoruz

  if (error) {
    return res.status(400).send(result.error.details[0].message);
  }

  product.name = req.body.name;
  product.price = req.body.price;

  res.send(product);
  */
  // const result=await Product.updateOne({_id:req.params.id},{$set:{name:"iphone 19"}})//güncellemenin başarılı-başarısız oldugunu belirten obje döner.
  const result = await Product.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive,
        category: req.body.category,
      },
    },
    { new: true }
  ); //güncellenen değeri döndürür. new:true ile default false orjinali döndürür
  res.send(result);
});

router.delete("/:id", auth, async (req, res) => {
  /*//1.yöntem
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }

  const index = products.indexOf(product);
  products.splice(index, 1);
  res.send(product);
*/
  //ilk eşleşen _id değerini siler
  // const result=await Product.deleteOne({ _id: req.params.id}); // returns {deletedCount: 1}
  const result = await Product.findOneAndDelete({ _id: req.params.id }); // returns {deletedCount: 1}//silinen veriyi döndürür
  // const result=await Product.findByIdAndDelete({ _id: req.params.id});//silinen veriyi bu metotda döndürür.
  res.send(result);
});

router.get("/:id", auth, async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "category",
    "name -_id"
  ); //product ın category özelliğinin name alanını getir.;
  // const product2 = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send("aradığınız ürün bulunamadı.");
  }
  res.send(product);
});

module.exports = router;
