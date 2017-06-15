var fs = require('fs')
var PDFDocument = require('pdfkit')

exports.generar = function (obj) {
  var doc = new PDFDocument()
  doc.pipe(fs.createWriteStream('Trabajo_Personal ' + obj.personal.info.cedula + ' ' + obj.personal.info.apellido + ' ' + obj.personal.info.nombre + '.pdf'))
  var body = 'Quien suscribe: ' + obj.director.profesion + '. ' + obj.director.nombre + '. Titular de la Cédula  de  Identidad  Nº ' + obj.director.cedula + '. Director (a)  de  Dependencia: ' + obj.director.dependencia + ', a través de la presente informo que  el  (la)  Ciudadano  (a): ' + obj.personal.info.nombre + ', titular de la  Cedula de identidad  Nº ' + obj.personal.info.cedula + ', cumple funciones en esta institución Educativa  desde: ' + obj.personal.fechaIngreso + ' hasta la presente fecha, por necesidad de servicios, desempeñando el cargo de ' + obj.personal.cargo + ', Código de cargo Nº ' + obj.personal.cod_cargo + ', en el turno de la ' + obj.personal.turno + ', y es nomina de: ' + obj.personal.dependencia + ' Código  de dependencia  Nº 06   ' + obj.cod_dea + '. Devengando un sueldo de ' + obj.personal.sueldo + 'Bsf.'
  var rowMembrete = 120
  var rowfirma = 640

  /* Imagen 1. */
  doc.rect(0, 0, 612, 90).fill('black')

  /* Imagen 2. */
  doc.rect(500, 100, 90, 90).fill('black')

  /* Membrete */
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
  .text('CONSTANCIA DE TRABAJO', 180, 250)

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

  /* Cuerpo del documento #2. */
  doc.text('', 90, 530)
  .font('Times-Roman', 13)
  .moveDown()
  .text(' Información que se emite a solicitud de la parte interesada, el ' + Date.now + '.', {
    width: 440,
    indent: 30,
    align: 'justify',
    height: 300,
    ellipsis: true
  })

  /* firma de la directora. */
  doc.text('_______________________', 240, rowfirma, {
    align: 'center',
    width: 150
  })
  .text(obj.director.profesion + '. ' + obj.director.nombre, 240, rowfirma + 15, {
    align: 'center',
    width: 150
  })
  .text('C.I ' + obj.director.cedula, 240, rowfirma + 30, {
    align: 'center',
    width: 150
  })
  .text('Tlf.' + obj.director.telefono, 240, rowfirma + 45, {
    align: 'center',
    width: 150
  })
  .text('DIRECTORA', 240, rowfirma + 60, {
    align: 'center',
    width: 150
  })

  /* Finalizar documento. */
  doc.end()
}
