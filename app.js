import express from 'express'
import logger from 'morgan'
import hbs from 'hbs'
import mongoose from "mongoose"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv'
import session from 'express-session';
import methodOverride from 'method-override'
import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';
import guestRouter from './routes/guestRouter.js';
import nocache from "nocache";
import { registerHelpers } from './utils/hbsHelpers.js';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()
app.use(logger('dev'))
app.use(nocache());
app.use(express.static('public'))
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.listen(process.env.PORT, () => {
    console.log(`Listening on PORT : ${process.env.PORT}`);
})
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000000 }
}));

//HBS helpers
registerHelpers(hbs);


// DB
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', err => console.error(err))
db.once('open', () => console.log('Connected to database'))

//Routers
app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/', guestRouter)