var fs = require('fs')
const path = require('path')
var PDFDocument = require('pdfkit')

exports.generar = function (obj) {
  var doc = new PDFDocument()
  doc.pipe(fs.createWriteStream('Constancia_estudio_' + obj.estudiante.info.cedula + '_' + obj.estudiante.info.apellidos + '_' + obj.estudiante.info.nombres + '.pdf'))
  var body = 'Quien suscribe,' + obj.director.profesion + '. ' + obj.director.nombre + ' ' + obj.director.apellido + ', Director(A) de la E.B.N Primero de MAYO II, hace constar por medio de la presente que el (la) alumno(a): ' + obj.estudiante.info.nombres + ' ' + obj.estudiante.info.apellidos + ', de ' + obj.estudiante.info.edad + ' años de edad, nacido(a) en: ' + obj.estudiante.info.direccion + ', fecha de nacimiento: ' + obj.estudiante.fechaNacimiento + ', cédula escolar N°: V ' + obj.estudiante.info.cedula + ', fue inscrito(a) en esta institución, para cursar el (' + obj.estudiante.anio + ') grado de Educación Básica.\n De acuerdo al artículo 108 del reglamento general de la ley orgánica de educación para cursar el nuevo año escolar: ' + obj.anioEscolar
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
    .text('CONSTANCIA DE ESTUDIO', 180, 250)

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
  doc.text('_______________________', 240, rowfirma, {
    align: 'center',
    width: 150
  })
    .text(obj.director.profesion + '. ' + obj.director.nombre + ' ' + obj.director.apellido, 240, rowfirma + 15, {
      align: 'center',
      width: 150
    })
    .text('DIRECTORA', 240, rowfirma + 60, {
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
