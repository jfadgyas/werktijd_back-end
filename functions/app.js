// Requirements
import express, { urlencoded, json } from 'express'
import ServerlessHttp from 'serverless-http'
import cors from 'cors'
import 'dotenv/config'
import Mongoose from 'mongoose'

// Routes
import workDay from './routes/workDay.js'
import users from './routes/users.js'

// Variables
const app = express()
const port = process.env.port || 3000

// Middleware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/workday', workDay)
app.use('/user', users)
// rooster?

// Connect to Db
Mongoose.connect(process.env.URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false
    },
    err => {
        err ? console.log(err) : console.log('Connected to database')
    }  
)

// Start app
app.listen(port, () => console.log(`Listening on port ${port}`))
export const handler = ServerlessHttp(app)