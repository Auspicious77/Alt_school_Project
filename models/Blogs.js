const mongoose = require('mongoose')

const {ObjectId} = mongoose.Schema.Types

const blogSchema = mongoose.Schema({
    blog: {
        type: String,
        required: true
    },
    blogBy: {
        type: ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Blog', blogSchema)