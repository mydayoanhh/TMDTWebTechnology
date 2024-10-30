const express = require("express")
const bcrypt = require("bcrypt");
const User = require("../Model/user.js");

const user_router = express.Router()


user_router.post('/register', async (req,res)=>{
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)


        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        })

        await newUser.save()
        res.status(200).json(newUser)
    } catch (error) {
        console.log(error)
    }
})

user_router.post('/login', async (req,res)=>{
    try {
        const user = await User.findOne({username: req.body.username})
        if(!user) return res.status(500).json("Not found user")
        
        const isPasswordCornect = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordCornect) 
            return res.status(500).json("wrong password")

        // res.status(200).send("Login sucessfull")
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
})

module.exports = {user_router}