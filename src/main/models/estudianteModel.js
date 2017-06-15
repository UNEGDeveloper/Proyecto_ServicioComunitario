var mongoose = require('mongoose')
var Schema = mongoose.Schema

var estudianteSchema = Schema({
  cedula: {
    type: String,
    uniqued: true
  },
  info: {
    type: Schema.Types.ObjectId,
    ref: 'Persona'
  },
  matricula: {
    type: Schema.Types.ObjectId,
    ref: 'Matricula'
  },
  representante: {
    cedula: String,
    nombre: String,
    apellido: String,
    telefono: String
  },
  genero: {
    type: String,
    default: 'M'
  },
  fechaNacimiento: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Estudiante', estudianteSchema)
