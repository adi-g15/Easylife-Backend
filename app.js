const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const adminRouter = require("./routes/admin");
const custRouter = require("./routes/cust");
const infoRouter = require("./routes/info");
const cartRouter = require("./routes/cart");

const { notOnProduction } = require("./utils/auth");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || "mongodb://localhost";

const dbOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    dbName: "easylife_dev",
    w: "majority",
};

mongoose.connect( DB_URI, dbOptions ).catch(err => {
    console.log("Couldn't connect to remote DB. Trying to connect to localhost...");

    mongoose.connect("mongodb://localhost", dbOptions)
                .catch(
                    err => console.error(err)
                )
})

mongoose.connection.on( "error", (err) => {
    console.error(`Error in DB connection: mongo DB couldn't be reached`);
    console.error(err.code);
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

// app.use(notOnProduction);    // removing not on production from now on

app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/info", infoRouter);
app.use("/cust", custRouter);

app.listen(PORT, () => {
    console.log(`Server up and listening at ${PORT}`);
});
