const express = require("express");
const app = express();
const morgan = require("morgan");

const { exit } = require("process")

require("dotenv").config();

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/login', (req,res) => {
    console.log("Login Successful");

    res.send({
        token: "dar34r3djs219s"
    });
})

app.use('/signup', (req, res) => {
    console.log("Successful signup");

    res.redirect('login');  // client receives a 302 here itself /login doesn't even execute
})

app.listen(80, () => {
    console.log(`Server up and listening at ${80}`);
});
