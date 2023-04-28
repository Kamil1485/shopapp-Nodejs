const jwt=require("jsonwebtoken");
const config=require("config");
//Kullanıcının istekleri dogrulanır
module.exports=(req,res,next)=>{//gelen request içinde header bölümünde x-auth-token içeren veri varmı arayacak fonksiyon
const token = req.header("x-auth-token");   
if(!token){
   return  res.status(401).send("Yetkisiz istek")
}
try{
    const decodedToken=jwt.verify(token,config.get("jwtPrivateKey"));//çözülmüs olan token içerisnde payload verisi gelir.
    req.user=decodedToken//request  user adında prop olusturarak decodedtoken atama,req aracılıgıyla her yerde erişmek için user verisini
    next();
}
catch(err){
    res.status(400).send("Gecersiz veya hatalı token");
}
}