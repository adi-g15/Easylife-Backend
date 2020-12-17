const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");

const adminRouter = require("./routes/admin");
const custRouter = require("./routes/cust");
const infoRouter = require("./routes/info");
const cartRouter = require("./routes/cart");

const { exit } = require("process")

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || "mongodb://localhost";

mongoose.connect( DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    dbName: "easylife_dev",
    w: "majority",
}).catch(err => {
    console.error(`Error in DB connection: mongo DB couldn't be reached`);
    console.error(err.code);
    exit(1);
})

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res) => {
    res.send( `Dear ${req.headers.from}, You don't have enough permissions to hit the endpoint...` )
});

app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/info", infoRouter);
app.use("/cust", custRouter);

app.listen(PORT, () => {
    console.log(`Server up and listening at ${PORT}`);
});
