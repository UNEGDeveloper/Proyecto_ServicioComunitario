var fs = require('fs')
const path = require('path')
var PDFDocument = require('pdfkit')
exports.generar = function (obj) {
  var doc = new PDFDocument()
  doc.pipe(fs.createWriteStream('Numeros de emergencia.pdf'))
  var rowMembrete = 120
  var rowCuerpo = 370
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
  doc.fontSize(15)
    .text('ESTRATEGIA DE RESGUARDO DE LAS INSTITUCIONES ESCOLARES, GOBIERNO DE CALLE, PUEDES LLAMAR:', 110, 230, {
      align: 'center',
      width: 400
    })

  /* Cuerpo del documento. */
  doc.text('', 90, 300)
    .font('Times-Roman', 13)
    .moveDown()

  doc.fontSize(13)
    .text(obj.director.cargo + ': ' + obj.director.nombre + ' ' + obj.director.apellido + ' . Tlf.: ' + obj.director.telefono + '\n\nSubdirector Pedagógica ( E ) Teléf.: 0416-7983210/ 0416-3789604\n\nSubdirector Administrativo( E ) Teléf.: 0424-9614896\n\nCarolina Guevara Teléf.: 0414-8917366\n\nGermán Martínez Teléf.: 0426-5917725\n\nCarmen Mujica Teléf.: 0426-3993489\n\nDirector de la Policía Ciudadano Ayala Teléf.: 0424-9332376\n\nPolicía Patrullero Ciudadano Rómulo Teléf.: 0424-9373626\n\nPatrulleros del Cuadrante Nueva Chirica Teléf.: 0416-6104280\n\nPastorita Garrido Teléf.: 0424-9386967 ', 60, rowCuerpo, {
      align: 'left',
      width: 500
    })

  for (var i = 0, len = obj.responsables.length; i < len; i++) {
    rowCuerpo = rowCuerpo + 20
    doc.fontSize(13)
      .text(obj.responsables[i].cargo + ': ' + obj.responsables[i].info.nombre + ' ' + obj.responsables[i].info.apellido + ' . Tlf.: ' + obj.responsables[i].telefono, 60, rowCuerpo, {
        align: 'left',
        width: 500
      })
  }

  /* Finalizar documento. */
  doc.end()
}
