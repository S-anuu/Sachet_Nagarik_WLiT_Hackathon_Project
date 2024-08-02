const mongoose = require('mongoose');

const QuerySchema = mongoose.Schema({
  title: String,
  description: String,
  author: String,
  supportCount: { type: Number, default: 0 },
  oppositionCount: { type: Number, default: 0 },
  supportUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  oppositionUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Queries', QuerySchema);
