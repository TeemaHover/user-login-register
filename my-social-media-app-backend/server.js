const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const User = require('./models/userProfile')

const app = express()

app.use(cors())
app.use(bodyParser.json())
// app.use('/api/posts',require('./routes/posts'))

mongoose.connect('mongodb+srv://b20fa1719:nMmC6GOwb5bd28fW@my-social-media-app.qoodzmj.mongodb.net/')

mongoose.connection.on('connected',() =>{
    console.log('Connected to MongoDB')
})

const port = process.env.PORT || 3000

app.listen(port,() =>{
    console.log(`Server running ${port}`)
})

// const newUser = new User({
//     username:'john_doe',
//     email:'john@example.com',
//     password:'hashed_password',
// })

// newUser.save().then((user) => {
//     console.log('User saved:',user)
// }).catch((error) =>{
//     console.log('Error saving user:', error)
// })
