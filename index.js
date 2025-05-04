const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const productRouter = require("./routes/product.router")
const userRouter = require("./routes/user.router")
const orderRouter = require("./routes/order.router")
const mongoose = require("./db/connection")
const app= express();
app.use(cors());
app.use(bodyParser.json());

app.use("/product",productRouter)
app.use("/user",userRouter)
app.use("/order", orderRouter)
app.use("/", (req,res)=>{
    res.status(200).send("Application is running")
})


app.use((req,res)=>{
    res.status(404).send(`<html>
    <head>
        <title>404</title>
    </head>
    <body>
        <h1>PAGE NOT FOUND</h1>
    </body>
</html>`)
 })

// app.listen(8000,(err)=>{
//     if(err)
//         console.log("err",err);
//     console.log("server listening on 8000")
// });

module.exports = app;