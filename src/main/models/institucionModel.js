var mongoose = require('mongoose')
var Schema = mongoose.Schema

var institucionSchema = Schema({
  codigoDependencia: {
    type: String,
    unique: true,
    uppercase: true
  },
  nombre: String,
  responsable: {
    type: Schema.Types.ObjectId,
    ref: 'Personal'
  },
  personalReponsables: [{
    type: Schema.Types.ObjectId,
    ref: 'Personal'
  }],
  codigoDea: {
    type: String,
    uppercase: true
  },
  codigoEstadistico: {
    type: String,
    uppercase: true
  }
})

module.exports = mongoose.model('Institucion', institucionSchema)
