const express = require('express')
const nodemailer = require("nodemailer");
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const router = require('./router/index');
const morgan = require('morgan');
const methodOverride = require('method-override')
const handlebars = require('express-handlebars');
require("dotenv").config();
const path = require('path');
const axios = require('axios');
const PORT = process.env.PORT || 3000
const app = express()
// config defaults
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
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
app.post('/chat', async (req, res) => {
    const {message} = req.body;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`
                }
            }
        );
        res.json({reply: response.data.choices[0].message.content});
    } catch (error) {
        console.error('Error:', error.response.data.error.message);
        res.status(500).json({error: 'Internal server error'});
    }
})

app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}`)
})