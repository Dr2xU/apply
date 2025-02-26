const mongoose = require('mongoose')

const RemoteJobSchema = new mongoose.Schema({
  id: Number,
  url: String,
  title: String,
  company_name: String,
  company_logo: String,
  category: String,
  job_type: String,
  publication_date: Date,
  candidate_required_location: String,
  salary: String,
  description: String,
})

module.exports = mongoose.model('RemoteJob', RemoteJobSchema)
