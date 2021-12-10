import express from 'express'
import bcrypt from 'bcrypt'
import user from '../models/users.js'

const router = express.Router()

// Get users (remove in production)
router.get('/', async (req,res) => {
    const users = await user.find()
    res.json(users)
})

// Find user in Db, then check if the pw correct
router.post('/', async (req, res) => {
    try{
        const currentUser = await user.findOne({
            userId: req.body.userId
        })
        if (!currentUser) return res.status(404).send()
        // Check if the passwords match
        bcrypt.compare(req.body.pw, currentUser.password, function(error, isMatch){
            if (error) return res.status(500).send
            isMatch ? res.status(200).send() : res.status(401).send()
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send
    }
})

// Update or create user
router.patch('/', async (req, res) => {
    try{
        const whichUser = await user.findOneAndUpdate({
            userId: req.body.userId
        },
        {
            $set: {
                userId: req.body.userId,
                password: hashPassword(req.body.pw)
            }
        },
        {
            upsert: true,
            new: true
        })
        res.json({success: 'User updated'})
    }
    catch(err){
        console.log(err)
    }
})

// Hash the user's password
const hashPassword = plainPw => {
    const salt = bcrypt.genSaltSync(10)
    const hashedPw = bcrypt.hashSync(plainPw, salt)
    return hashedPw
}

export default router