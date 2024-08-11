const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  website: { type: String, required: true },
  companyName: { type: String, required: true },
  contactName: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  origin: { type: String, enum: ['Candidature spontanée', 'Job offer'], required: true },
  status: { type: String, enum: ['Interested', 'CV sent', 'Negative', 'Interview'], required: true },
  comments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
