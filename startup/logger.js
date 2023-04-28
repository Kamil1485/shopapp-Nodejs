const {transports,createLogger,format} = require('winston');
const {combine,timestamp,prettyPrint}=format;
const config=require("config");
require("winston-mongodb");

// const username="kamilkaraisli";
// const password="kamil_09";
// const database="shopdb";

const username = config.get("db.username");
const password = config.get("db.password");
const name = config.get("db.name");


const logger = createLogger({//Hata işlemleri
    level: "debug",
    // format: winston.format.json(),
    format:combine(timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),prettyPrint()),//hata olusma zamanınıda kaydeder
    transports: [
        new transports.Console(),
        //maxFiles:3d 3gün içinde silinir veriler
        new transports.File({filename:"logs/logs.log",level:"error"}),//hata error seviyesinde ise dosyaya ve database kaydet,default:debug,hatalarını console da göster ayarladım.
        new transports.File({filename:"logs/execptions.log",level:"error",handleExceptions:true,handleRejections:true,maxFiles:"3d"}),//uncaught execption
        new transports.MongoDB({level:"error",db:`mongodb+srv://${username}:${password}@cluster0.sthcgwx.mongodb.net/${name}?retryWrites=true&w=majority`
        ,options:{
            useUnifiedTopology:true
        },
        collection:"server_logs"//veritabanına  bu isimle  olusturulup kaydedilecek hatalar.
    })
        
    ]
    
});

module.exports = logger;
