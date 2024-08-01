var mongoose = require('mongoose')

const ComplaintSchema = mongoose.Schema({
    title : String,
    postedBy : String,
    topic: {
        type : String,
        enum : ['Transportation', 'Women Rights', 'Electricity', 'Drinking Water', 'Environment', 'Pollution', 'Natural Disasters']
    },
    description : String,
    postedAt : { type : Date, default : Date.now }
})

module.exports = mongoose.model('Complaints', ComplaintSchema)
