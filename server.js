const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const memeberRouter = require('./routes/member')
const authRouter = require('./routes/auth')

/**
 * confiqure the dotenv file
 */
dotenv.config()

/**
 * Connect to databse
 */

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('Connected to database')
})



/***************** Middlewares */

/**
 * BodyParser middleware
 */
 app.use(express.json())

/**
 * Use Our Auth router as a middleware
 */

app.use('/api/auth', authRouter)
app.use('/api/members', memeberRouter)


app.listen(3000, () => console.log('server running on port 3000'))