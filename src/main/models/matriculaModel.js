var mongoose = require('mongoose')

var Schema = mongoose.Schema

var matriculaSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  turno: {
    type: String,
    max: 1,
    default: 'M'
  },
  anio: Number,
  seccion: {
    type: String,
    uppercase: true
  },
  docente: {
    type: Schema.Types.ObjectId,
    ref: 'Docente',
    default: null
  },
  estudiantes: [{
    type: Schema.Types.ObjectId,
    ref: 'Estudiante',
    default: []
  }]
})

module.exports = mongoose.model('Matricula', matriculaSchema)
