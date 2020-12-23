const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const adminRouter = require("./routes/admin");
const custRouter = require("./routes/cust");
const infoRouter = require("./routes/info");
const cartRouter = require("./routes/cart");

const { exit } = require("process");
const { notOnProduction } = require("./utils/auth");

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

mongoose.connection.on( "error", () => {
    console.log("Couldn't connect to remote DB. Trying to connect to localhost...");

    mongoose.connect("mongodb://localhost").then(() => {
        console.log(`Connected to the database: ${mongoose.connection.db.databaseName}`)
    })
    .catch(
        err => console.error(err)
    )
})

mongoose.connection.once( "open", () => {
    console.log(`Connected to the database: ${mongoose.connection.db.databaseName}`);
})

app.use(cors({
    methods: ["GET"],
}))
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(notOnProduction);

app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/info", infoRouter);
app.use("/cust", custRouter);

app.listen(PORT, () => {
    console.log(`Server up and listening at ${PORT}`);
});
