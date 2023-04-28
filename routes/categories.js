const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Category, validateCategory } = require("../models/category");


router.get("/", async (req, res) => {
  const categories = await Category.find().populate("products","name -_id")//sadece name alanını getir ayrıca product _id hariç tut default geldiği için;
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  //Read
  const category = await Category.findOne({ _id: req.params.id });
  if (!category) {
    return res.status(404).send("Aradığınız ürün bulunamadı.");
  }
  res.send(category);
});

router.post("/", async (req, res) => {
  //Create
  const { error } = validateCategory(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const category = new Category({
    name: req.body.name,
    products:req.body.products//one to many ilişki
  });
  try {
    const result = await category.save(); //category 1
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  //Update
  const result = await Category.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { name: req.body.name } },
    { new: true } //güncellenen değeri döndürür. new:true ile
  );
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  //Delete
  const result = await Category.findOneAndDelete({ _id: req.params.id }); // returns {deletedCount: 1}//silinen veriyi döndürür
  res.send(result);
});

module.exports = router;
