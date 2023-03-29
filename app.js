import express from 'express'
import logger from 'morgan'
import hbs from 'hbs'
import mongoose from "mongoose"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv'
import userRouter from './routes/userRouter.js';
// import twilioRouter from './routes/twilioRouter.js'
import adminRouter from './routes/adminRouter.js';
import session from 'express-session';
import methodOverride from 'method-override'

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()
app.use(logger('dev'))
app.use(express.static('public'))
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.listen(process.env.PORT, () => {
    console.log(`Listening on PORT : ${process.env.PORT}`);
})
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000000 }
}));

// HBS helper
hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});

// DB
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', err => console.error(err))
db.once('open', () => console.log('Connected to database'))

//Routers
app.use('/user', userRouter)
app.use('/admin', adminRouter)

app.get('/', (req, res) => {
    res.status(200).render('index', { title: "Rifurn" })
})