var mongoose = require('mongoose')

var Schema = mongoose.Schema

var docenteSchema = Schema({
  codigo: {
    type: String,
    unique: true,
    uppercase: true
  },
  info: {
    type: Schema.Types.ObjectId,
    ref: 'Persona'
  },
  matricula: {
    type: Schema.Types.ObjectId,
    ref: 'Matricula',
    default: null
  },
  cargo: {
    type: String,
    default: 'Docente de Aula'
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  },
  telefono: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('Docente', docenteSchema)
