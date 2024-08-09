const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const router = require('./router/index');
const morgan = require('morgan');
const methodOverride = require('method-override')
const handlebars = require('express-handlebars');
require("dotenv").config();
const path = require('path');
const PORT = process.env.PORT || 3000
const app = express()
// config defaults
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}));
app.use(cookieParser());
app.use(morgan('combined'))
app.use(bodyParser.json());// Use static folder
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended: true}));
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
    },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));
//router
router(app)
//
app.use("/", (req, res) => {
    res.send("Hello world")
})
app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}`)
})