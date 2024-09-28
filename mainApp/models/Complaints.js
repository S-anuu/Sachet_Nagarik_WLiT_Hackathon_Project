// /home/anuuu/Documents/Sachet_Nagarik_Final/Backend/mainApp/models/Complaints.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  title: String,
  postedBy: String,
  date: {
    type: Date, default: Date.now
  },
  location: String,
  description: String,
  genre: String,
  supportUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  oppositionUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  supportCount: { type: Number, default: 0 },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  oppositionCount: { type: Number, default: 0 },
});

const Complaints = mongoose.model('Complaints', complaintSchema);
module.exports = Complaints;
