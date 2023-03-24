import express from 'express'
import logger from 'morgan'
import hbs from 'hbs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(logger('dev'))
app.use(express.static('public'))
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.status(200).render('index', {title: "Rifurn"})
})
app.listen(process.env.PORT, () => {
    console.log(`Listening on PORT : ${process.env.PORT}`);
})
