import express from 'express'
import workDay from '../models/workDay.js'

const router = express.Router()

// If no user => error ?
// router.get('/', async (req, res) => {
//     res.send('Missing user!')
// })

// Get all workdays for the user
router.get('/:userId', async (req, res) => {
    try{
        const usersDays = await workDay.find({
            userId: req.params.userId
        }).then((usersDays, err) => {
            if (err) return res.status(400).json({error: err})
            res.json(usersDays)
        })
    }
    catch(err){
        res.status(500).json({error: err})
    }
})

// Get one workday for the user
router.get('/:userId/:currentDay', async (req, res) => {
    const whichDay = new Date(+req.params.currentDay).toLocaleDateString()
    try{
	// Later find if more checkin/day will be available
        const day = await workDay.findOne({
            $and: [
                {userId: req.params.userId},
                {dayId: whichDay}
            ]
        }).then((day, err) => {
            if (err) return res.status(400).json({error: err})
            res.json(day)
        })
    }
    catch(err){
        res.status(500).json({error: err})
    }
})

// Store new times for the day, or modify from the dashboard. If the day not exists, create it (upsert)
router.patch('/:userId/:currentDay', async (req, res) => {
    const whichDay = new Date(+req.params.currentDay).toLocaleDateString()
    try{
        const updateDay = await workDay.findOneAndUpdate({
            $and: [
                {userId: req.params.userId},
                {dayId: whichDay}
            ]
        },
        {
            $set: {
                dayId: whichDay,
                checkIn: req.body.checkIn,
                checkOut: req.body.checkOut,
                pause: req.body.pause
            }
        },
        {
            upsert: true,
            new: true
        }        
        )
        .then((updateDay, err) => {
            if (err) return res.status(400).json({error: err})
            res.json(updateDay)
        })
    }
    catch(err){
        res.status(500).json({error: err})
    }
})

export default router