var fs = require('fs')
const path = require('path')
var PDFDocument = require('pdfkit')
var dateFormat = require('dateformat')
var now = new Date()

exports.generar = function (obj) {
  var doc = new PDFDocument()
  doc.pipe(fs.createWriteStream('Sexto_Grado ' + obj.estudiante.info.cedula + ' ' + obj.estudiante.info.apellidos + ' ' + obj.estudiante.info.nombres + '.pdf'))
  var body = 'Quien suscribe: ' + obj.director.profesion + '. ' + obj.director.nombre + ' ' + obj.director.apellido + ', Director (a) de la E.B.N. 1º DE MAYO II, que funciona en la urbanización Nueva Chirica de San Félix- Edo. Bolívar. Después de haber revisado el libro de acta de exámenes finales del año ' + obj.periodo + ', hace constar por medio de la presente, que el o (la) Ciudadano (a) ' + obj.estudiante.info.apellidos + ' ' + obj.estudiante.info.nombres + ', titular de la cédula de identidad Nº V' + obj.estudiante.info.cedula + ', natural de  ' + obj.estudiante.info.direccion + ', nacido (a) el: ' + obj.estudiante.fechaNacimiento + ', cursó y aprobó el sexto grado de educación básica y obtuvo LITERAL: ' + obj.estudiante.nota + '.'
  var rowMembrete = 120
  var rowfirma = 650

  /* Imagen 1. */
  doc.image(path.join(__static, 'img/head.jpeg'), 0, 0, {width: 612})
    .text('', 0, 0)

  /* Imagen 2. */
  doc.image(path.join(__static, 'img/logo.jpeg'), 500, 100, {width: 90})
    .text('', 0, 0)

  /* Membrete. */
  doc.fontSize(10)
    .text('REPÚBLICA BOLIVARIANA DE VENEZUELA', 160, rowMembrete, {
      align: 'center',
      width: 300
    })
    .text('MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN', 160, rowMembrete + 10, {
      align: 'center',
      width: 300
    })
    .text('E.B.N 1º DE MAYO II', 160, rowMembrete + 20, {
      align: 'center',
      width: 300
    })
    .text('SAN FELIX. EDO. BOLÍVAR', 160, rowMembrete + 30, {
      align: 'center',
      width: 300
    })
    .text('CÓDIGO: 006731011', 160, rowMembrete + 40, {
      align: 'center',
      width: 300
    })

  /* Título. */
  doc.fontSize(20)
    .text('CONSTANCIA DE SEXTO GRADO', 150, 250)

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

  /* Firma de la directora. */
  doc.text('_______________________', 100, rowfirma, {
    align: 'center',
    width: 150
  })
    .text(obj.director.profesion + '. ' + obj.director.nombre + ' ' + obj.director.apellido, 100, rowfirma + 15, {
      align: 'center',
      width: 150
    })
    .text('DIRECTOR (A)', 100, rowfirma + 30, {
      align: 'center',
      width: 150
    })

  /* Firma del representante. */
  doc.text('_______________________', 364, rowfirma, {
    align: 'center',
    width: 150
  })
    .text('Firma del Representante', 364, rowfirma + 15, {
      align: 'center',
      width: 150
    })

  /* Cuerpo del documento. */
  doc.text('', 90, 530)
    .font('Times-Roman', 13)
    .moveDown()
    .text('Constancia que se expide de la parte interesada, el día ' + dateFormat(now, 'dd') + ', del mes ' + dateFormat(now, 'mm') + ' del año ' + dateFormat(now, 'yyyy'), {
      width: 440,
      align: 'justify',
      height: 300,
      ellipsis: true
    })

  /* Finalizar documento. */
  doc.end()
}
