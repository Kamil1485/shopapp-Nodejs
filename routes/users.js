const express = require("express");
const router = express.Router();
const { User, validateRegister,validateLogin } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
const users=await User.find();
res.send(users);
});

router.post("/create", async (req, res) => {
 
  //const token=user.createAuthToken()  token olusturulur loginde de aynı işlem yapılır
  const validate = validateRegister(req.body); //Kayıt olmak için giriş kontrolü
  if (validate.error) {
    return res.status(400).send(validate.error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("Mail adresi kullanımda");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10); //saltRounds:10 zorluk derecesi
   user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    isAdmin:req.body.isAdmin,
  });
    await user.save();
    const token=user.createAuthToken()
    res.header("x-auth-token", token).send(user);//x-auth-token isimli(prop),value:token olan header nesnesi olusturur.
});

router.get("/auth",async(req,res)=>{//login //token görüntülenir
    const validate = validateLogin(req.body); //Kayıt olmak için giriş kontrolü(kurallara uygun kelimeler girmiş mi?)
    if (validate.error) {
      return res.status(400).send(validate.error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });//email kontrolü, girilen emaile ait kullanıcı varmı var ise sifre kontrolüne geç
    if (!user) {
      return res.status(400).send("Parola veya Mail hatalı");
    }
    const isTrue=await bcrypt.compare(req.body.password,user.password)//girilen sifre ile kayıtlı sifre karsılastırılır
    if(!isTrue){
        return res.status(400).send("Parola yanlış");
    }
    const token = user.createAuthToken();
    res.send(token);

})
module.exports = router;
