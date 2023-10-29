const mongoose = require("mongoose")
mongoose.set("strictQuery", true)

const { MONGOURL } = require("./prod")

const connectDB = async ()=> {
mongoose.connect(MONGOURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
// mongoose.connection.on('connected', () => { console.log("Connected to mongo yeahhhh!") })

// mongoose.connection.on('error', (err) => { console.log("error", err) })
}

module.exports = { connectDB}