var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  pass: String,
  creado: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
