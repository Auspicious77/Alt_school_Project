require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET, MONGOURL} = require('./config/keys')
const Blog = require('./models/Blogs')
const { connectDB } = require('./config/Db')





app.get('/', (req, res) => {
    res.json({ message: 'Hello Welcome to my blog App' })
})
app.use(express.json())
app.use(cors())

const requireLogin = (req, res, next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "You must be logged in"})
    }
    try{
        const {userId} = jwt.verify(authorization, JWT_SECRET)
        req.user = userId
        next()
    }
    catch(err){
        return res.status(401).json({error: "You must be logged in"})

    }
}

app.get('/test', requireLogin, (req, res) => {
    console.log('connected')
res.json({message: req.user})
})

//post request to server
app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        if (!email || !password) {
            return res.status(422).json({ error: 'Please add all fields' })
        }
        // if user already exist
        const user = await User.findOne({ email })
        if (user) {
            return res.status(422).json({ error: "User already exist with that email" })
        }
        //encript password
        const hashpassword = await bcrypt.hash(password, 12)
        await new User({
            email,
            password: hashpassword
        }).save()
        res.status(200).json({ message: "SignUp successful you can now log in" })
    }
    catch (err) {
        console.log(err)
    }
})

//sign in

app.post('/signin', async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        if (!email || !password) {
            return res.status(422).json({ error: 'Please add all fields' })
        }
        // if user already exist
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: "No user found with that email or password" })
        }
        //encript password
       const doMatch = await bcrypt.compare(password, user.password)
       if(doMatch){
        const token = jwt.sign({userId: user._id}, JWT_SECRET)
         res.status(201).json({token})
       }
       else{
        return res.status(401).json({error: "email or password is invalid"})
       }
    }
    catch (err) {
        console.log(err)
    }
})

//Blog
app.post('/createblog', requireLogin,async (req, res) => {
    const data = await new Blog({
        blog: req.body.blog,
        blogBy: req.user
    }).save()
    res.status(201).json({message: data})
})

app.get('/getblogs',  requireLogin,async (req, res) => {
    const data = await Blog.find({
    blogBy:req.user
    })
    res.status(200).json({message: data})
})

app.delete('/remove/:Id',requireLogin ,async(req, res)=>{
   const removedBlog = await Blog.findOneAndRemove({_id: req.params.Id})
   res.status(200).json({message: removedBlog})

})

if(process.env.NODE_ENV == 'production'){
    const path = require('path')
    app.get('/', (req, res) => {
        app.use(express.static(path.resolve(__dirname, 'client', 'build')))
        res.sendFile(path.resolve(__dirname, 'client', 'build','index.html'))
    }) 
}

connectDB().then(()=> {

    app.listen(PORT, () => {
        console.log("Server Running on", PORT) 
    })
})