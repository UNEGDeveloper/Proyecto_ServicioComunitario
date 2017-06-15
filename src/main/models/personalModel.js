var mongoose = require('mongoose')

var Schema = mongoose.Schema

var personalSchema = Schema({
  codigo: {
    type: String,
    unique: true,
    uppercase: true
  },
  info: {
    type: Schema.Types.ObjectId,
    ref: 'Persona'
  },
  profesion: {
    type: String,
    default: ''
  },
  cargo: {
    type: String,
    default: ''
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  },
  telefono: {
    type: String,
    default: ''
  },
  dependencia: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('Personal', personalSchema)
