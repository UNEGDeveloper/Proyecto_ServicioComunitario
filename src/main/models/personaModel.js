var mongoose = require('mongoose')

var Schema = mongoose.Schema

var personaSchema = Schema({
  cedula: {
    type: String,
    unique: true,
    required: true
  },
  nombre: {
    type: String,
    default: ''
  },
  apellido: {
    type: String,
    default: ''
  },
  direccion: {
    type: String,
    default: ''
  },
  edad: {
    type: Number,
    default: 5
  }
})

module.exports = mongoose.model('Persona', personaSchema)
