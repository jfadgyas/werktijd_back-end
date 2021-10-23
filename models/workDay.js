import Mongoose from 'mongoose'

const pauseSchema = Mongoose.Schema({
    start: Number,
    end: Number
})

const workDaySchema = Mongoose.Schema({
    userId: String,
    checkIn: Number,
    checkOut: Number,
    pause: [pauseSchema]
})

export default Mongoose.model('workday', workDaySchema)