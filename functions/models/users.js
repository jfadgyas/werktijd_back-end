import Mongoose from "mongoose"

const userSchema = Mongoose.Schema({
    userId: String,
    password: String,
    email: String
})

export default Mongoose.model('user', userSchema)