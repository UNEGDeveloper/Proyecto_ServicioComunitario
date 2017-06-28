var fs = require('fs')
const path = require('path')
var PDFDocument = require('pdfkit')

exports.generar = function (obj) {
  var doc = new PDFDocument()
  doc.pipe(fs.createWriteStream('Retiro ' + obj.estudiante.info.cedula + ' ' + obj.estudiante.info.apellidos + ' ' + obj.estudiante.info.nombres + '.pdf'))
  var body = 'Quien suscribe: ' + obj.director.profesion + '. ' + obj.director.nombre + ' ' + obj.director.apellido + ', Director (a) de la E.B.N. 1º DE MAYO II, código estadístico: ' + obj.cod_estadistico + '; código DEA: ' + obj.cod_dea + ', certifica por medio de la presente que el(la) alumno(a) ' + obj.estudiante.info.apellidos + ' ' + obj.estudiante.info.nombres + ', de ' + obj.estudiante.info.edad + ' años de edad, con cédula escolar Nº: V' + obj.estudiante.info.cedula + ', natural de ' + obj.estudiante.info.direccion + '. Cursante del (' + obj.estudiante.anio + ') grado de Educación Básica, es retirado de este plantel el día ' + obj.retiro.date + '. Por la siguiente causa: ' + obj.retiro.causa + '. Legal: ' + obj.estudiante.representante.nombre + ' ' + obj.estudiante.representante.apellido + '.'
  var rowMembrete = 120
  var rowfirma = 600

  /* Imagen 1. */
  doc.image(path.join(__static, 'img/head.jpeg'), 0, 0, {width: 612})
  .text('', 0, 0)

  /* Imagen 2. */
  doc.image(path.join(__static, 'img/logo.jpeg'), 500, 100, {width: 90})
  .text('', 0, 0)

  /* Membrete. */
  doc.fontSize(10)
  .text('REPÚBLICA BOLIVARIANA DE VENEZUELA', 150, rowMembrete, {
    align: 'center',
    width: 300
  })
  .text('MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN', 150, rowMembrete + 10, {
    align: 'center',
    width: 300
  })
  .text('E.B.N 1º DE MAYO II', 150, rowMembrete + 20, {
    align: 'center',
    width: 300
  })
  .text('SAN FELIX. EDO. BOLÍVAR', 150, rowMembrete + 30, {
    align: 'center',
    width: 300
  })
  .text('CÓDIGO: 006731011', 150, rowMembrete + 40, {
    align: 'center',
    width: 300
  })

  /* Título. */
  doc.fontSize(20)
  .text('CONSTANCIA DE RETIRO', 180, 250)

  /* Cuerpo del documento. */
  doc.text('', 90, 300)
  .font('Times-Roman', 13)
  .moveDown()
  .text(body, {
    width: 440,
    lineGap: 8,
    align: 'justify',
    indent: 30,
    height: 300,
    ellipsis: true
  })

  /* firma de la directora. */
  doc.text('_______________________', 100, rowfirma, {
    align: 'center',
    width: 150
  })
  .text(obj.director.profesion + '. ' + obj.director.nombre + ' ' + obj.director.apellido, 100, rowfirma + 15, {
    align: 'center',
    width: 150
  })
  .text('DIRECTORA', 100, rowfirma + 30, {
    align: 'center',
    width: 150
  })

  /* firma del representante. */
  doc.text('_______________________', 364, rowfirma, {
    align: 'center',
    width: 150
  })
  .text('Firma del Representante', 364, rowfirma + 15, {
    align: 'center',
    width: 150
  })

  /* Cuerpo del documento. */
  doc.text('', 90, 700)
  .font('Times-Roman', 13)
  .moveDown()
  .text('Dirección: Urb. Nueva Chirica, Calle Principal, Diagonal a la Panadería El Funchal.', {
    width: 440,
    align: 'center',
    height: 300,
    ellipsis: true
  })
  .text('Teléfono: 0286-8089508', {
    width: 440,
    align: 'center',
    height: 300,
    ellipsis: true
  })

  /* Finalizar documento. */
  doc.end()
}
