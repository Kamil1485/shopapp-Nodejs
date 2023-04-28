const express = require("express");
const app = express();

require("./startup/logger");
require("./startup/routes")(app);
require("./startup/db")();
//Production settings
//process.env.NODE_ENV==="production" olarak da kontrol edilebilir.
if(app.get("env")==="production"){//uygulama production modunda calısıyorsa
    require("./startup/production")(app);
}
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});