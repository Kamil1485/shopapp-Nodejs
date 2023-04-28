module.exports=(req,res,next)=>{//gelen request içinde header bölümünde x-auth-token içeren veri varmı arayacak fonksiyon

const isAdmin=req.user.isAdmin;//auth bölümünde token verisi requestin user propu olusturup atanmıştı
if(!isAdmin){
    return  res.status(403).send("Yetkisiz erişim")
}
next();



}