'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
require('tungus')
const mongoose = require('mongoose')
var Institucion = require('./models/institucionModel')
var Estudiante = require('./models/estudianteModel')
var Personal = require('./models/personalModel')
var Persona = require('./models/personaModel')
var Matricula = require('./models/matriculaModel')
var Docente = require('./models/docenteModel')
var User = require('./models/userModel')
var fs = require('fs')
/**
* Set `__static` path to static files in production
* https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
*/
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
? `http://localhost:9080`
: `file://${__dirname}/index.html`

function createWindow () {
  /**
  * Initial window options
  */
  fs.stat('data/', (err) => {
    if (err) {
      fs.mkdir('data/')
    }
  })

  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    mongoose.disconnect()
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
* Auto Updater
*
* Uncomment the following code below and install `electron-updater` to
* support auto updating. Code Signing with a valid certificate is required.
* https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
*/

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
autoUpdater.quitAndInstall()
})

app.on('ready', () => {
if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('create_data', (event, arg) => {
  mongoose.connect('tingodb://data', function (err) {
    if (err) throw err
    createData()
  })

  function createData () {
    switch (arg.tipo) {
      case 0:
        User.create({
          name: arg.name,
          pass: arg.pass
        }, (errU) => {
          if (errU) {
            event.returnValue = {
              err: true,
              msj: 'Error:Ya existe el usuario ' + arg.name
            }
          } else {
            event.returnValue = {
              err: false,
              msj: 'Creado el usuario ' + arg.name
            }
          }
        })
        break
      case 1:
        Matricula.create({
          name: arg.name,
          turno: arg.turno,
          anio: arg.anio,
          seccion: arg.seccion
        }, (errM) => {
          if (errM) {
            event.returnValue = {
              err: true,
              msj: 'Error:Ya existe la matricula ' + arg.name
            }
          } else {
            event.returnValue = {
              err: false,
              msj: 'Creado la matricula ' + arg.name
            }
          }
        })
        break
      case 2:
        Matricula.findOne({name: arg.matricula}, (errM, docMatricula) => {
          if (errM) throw (errM)
          else {
            if (docMatricula) {
              Persona.create({
                cedula: arg.ci,
                nombre: arg.name,
                apellido: arg.lastname,
                direccion: arg.dir,
                edad: arg.edad
              }, function (errP, docPersona) {
                if (errP) {
                  event.returnValue = {
                    err: true,
                    msj: 'Error:Ya existe la Persona con cedula:' + arg.ci
                  }
                } else {
                  Estudiante.create({
                    info: docPersona,
                    cedula: arg.ci,
                    matricula: docMatricula,
                    representante: {
                      cedula: arg.rl.ci,
                      nombre: arg.rl.name,
                      apellido: arg.rl.lastname
                    },
                    genero: arg.genero,
                    fechaNacimiento: arg.fechaNacimiento
                  }, function (errE, docEstudiante) {
                    if (errE) {
                      docPersona.remove()
                      event.returnValue = {
                        err: true,
                        msj: 'Error:Imposible crear el Estudiante' + arg.ci
                      }
                    } else {
                      docMatricula.estudiantes.push(docEstudiante)
                      docMatricula.save((errM) => {
                        if (errM) {
                          event.returnValue = {
                            err: true,
                            msj: 'Error:Se creo el estudiante pero no se logro agregar a la materia' + arg.matricula
                          }
                        } else {
                          event.returnValue = {
                            err: false,
                            msj: 'Se a creado el Estudiante ' + arg.ci
                          }
                        }
                      })
                    }
                  })
                }
              })
            } else {
              event.returnValue = {
                err: true,
                msj: 'Error:La matricula' + arg.matricula + ' no esta en el sistema registrado'
              }
            }
          }
        })
        break
      case 3:
        Persona.create({
          cedula: arg.ci,
          nombre: arg.name,
          apellido: arg.lastname,
          direccion: arg.dir,
          edad: arg.edad
        }, (errP, docPersona) => {
          if (errP) {
            event.returnValue = {
              err: true,
              msj: 'Error:Ya existe una Persona con la cedula:' + arg.ci
            }
          } else {
            Matricula.findOne({name: arg.matricula}, (errM, docMatricula) => {
              if (errM) throw (errM)
              else {
                if (docMatricula) {
                  Docente.create({
                    codigo: arg.cod,
                    info: docPersona,
                    matricula: docMatricula,
                    cargo: arg.cargo,
                    telefono: arg.telf,
                    fechaIngreso: arg.fechaIngreso
                  }, (errD, docDocente) => {
                    if (errD) {
                      docPersona.remove()
                      event.returnValue = {
                        err: true,
                        msj: 'Error:Ya existe el Docente con codigo ' + arg.cod
                      }
                    } else {
                      docMatricula.docente = docDocente
                      docMatricula.save((errMM) => {
                        if (errMM) {
                          event.returnValue = {
                            err: true,
                            msj: 'Se ha creado el Docente' + arg.ci + 'pero no se guardo en la matricula seleccionada.'
                          }
                        } else {
                          event.returnValue = {
                            err: false,
                            msj: 'Se ha creado el Docente ' + arg.ci
                          }
                        }
                      })
                    }
                  })
                } else {
                  Docente.create({
                    codigo: arg.cod,
                    info: docPersona,
                    cargo: arg.cargo,
                    telefono: arg.telf,
                    fechaIngreso: arg.fechaIngreso
                  }, (errD, docDocente) => {
                    if (errD) {
                      docPersona.remove()
                      event.returnValue = {
                        err: true,
                        msj: 'Error:Ya existe el Docente con codigo ' + arg.cod
                      }
                    } else {
                      event.returnValue = {
                        err: false,
                        msj: 'Se ha creado el Docente ' + arg.ci
                      }
                    }
                  })
                }
              }
            })
          }
        })
        break
      case 4:
        Persona.create({
          cedula: arg.ci,
          nombre: arg.name,
          apellido: arg.lastname,
          direccion: arg.dir,
          edad: arg.edad
        }, (errP, docPersona) => {
          if (errP) {
            event.returnValue = {
              err: true,
              msj: 'Error:Ya existe la Persona con cedula:' + arg.ci
            }
          } else {
            Personal.create({
              codigo: arg.cod,
              cargo: arg.cargo,
              telefono: arg.telf,
              info: docPersona,
              profesion: arg.prof,
              fechaIngreso: arg.fechaIngreso,
              dependencia: arg.depend
            }, (errPl, docsPersonal) => {
              if (errPl) {
                docPersona.remove()
                event.returnValue = {
                  err: true,
                  msj: 'Error:Ya existe algun personal con codigo ' + arg.cod
                }
              } else {
                event.returnValue = {
                  err: false,
                  msj: 'Se creo el Personal ' + arg.cod
                }
              }
            })
          }
        })
        break
      default:
        event.returnValue = {
          err: true,
          msj: 'Error:Contante con el desarrollador'
        }
    }
  }
})

ipcMain.on('Constancia_Retiro', (event, arg) => {
  Institucion.findById(2).populate('responsable').exec(function (errI, docT) {
    if (errI) throw (errI)
    else {
      if (docT) {
        Estudiante.findOne({ cedula: arg.ci }).populate('info').populate('matricula').exec(function (err, doc) {
          if (err) {
            event.returnValue = {
              err: true,
              msj: 'Error:Conección con la BD' + arg.ci
            }
          } else {
            if (doc) {
              if (doc.matricula !== null) {
                Persona.populate(docT, {path: 'responsable.info'}, (errI, docI) => {
                  if (docI.responsable !== null) {
                    var docPdf = {
                      director: {
                        profesion: docI.responsable.profesion,
                        nombre: docI.responsable.info.nombre,
                        apellido: docI.responsable.info.apellido
                      },
                      cod_estadistico: arg.cod,
                      cod_dea: docI.codigoDea,
                      estudiante: {
                        info: {
                          apellidos: doc.info.apellido,
                          nombres: doc.info.nombre,
                          edad: doc.info.edad,
                          cedula: doc.info.cedula,
                          direccion: doc.info.direccion
                        },
                        anio: doc.matricula.anio,
                        representante: {
                          nombre: doc.representante.nombre,
                          apellido: doc.representante.apellido,
                          cedula: doc.representante.cedula
                        }
                      },
                      retiro: {
                        date: arg.date,
                        causa: arg.motivo
                      }
                    }
                    var constanciaRetiro = require('./pdf/constancia_retiro')
                    constanciaRetiro.generar(docPdf)
                    Matricula.findByIdAndUpdate(doc.matricula._id, { $pull: {estudiantes: doc._id} }, (errM, docMatricula) => {
                      if (errM) {
                        event.returnValue = {
                          err: true,
                          msj: 'Error:No se encuentra la matricula del estudiante'
                        }
                      } else {
                        doc.matricula = null
                        doc.save((errSE) => {
                          if (errSE) {
                            event.returnValue = {
                              err: true,
                              msj: 'Error:El estudiante no se elimino de su matricula'
                            }
                          } else {
                            event.returnValue = {
                              err: false,
                              msj: 'Estudiante retirado'
                            }
                          }
                        })
                      }
                    })
                  } else {
                    event.returnValue = {
                      err: true,
                      msj: 'Error:No hay un director asignador, registrelo por favor'
                    }
                  }
                })
              } else {
                event.returnValue = {
                  err: true,
                  msj: 'Error:Estudiante no matriculado (se retiro o se graduo).'
                }
              }
            } else {
              event.returnValue = {
                err: true,
                msj: 'Error:No se encuentra el Estudiante con Cedula ' + arg.ci
              }
            }
          }
        })
      } else {
        event.returnValue = {
          err: true,
          msj: 'Error:No se encuentra ninguna Institucion Guardada.'
        }
      }
    }
  })
})

ipcMain.on('Constancia_Emergencia', (event, arg) => {
  Institucion.findById(2).populate('responsable', 'cargo telefono info').populate('personalReponsables', 'cargo telefono info').exec(function (errI, docI) {
    if (errI) {
      throw (errI)
    } else {
      if (docI) {
        Persona.populate(docI, {path: 'responsable.info', select: 'nombre apellido'}, function (errID, docID) {
          Persona.populate(docID, {path: 'personalReponsables.info', select: 'nombre apellido'}, function (errID, docT) {
            var docPdf = {
              director: {
                cargo: docT.responsable.cargo,
                nombre: docT.responsable.info.nombre,
                apellido: docT.responsable.info.apellido,
                telefono: docT.responsable.telefono
              },
              responsables: docT.personalReponsables
            }
            var numeroEmergencia = require('./pdf/numero_emergencia')
            numeroEmergencia.generar(docPdf)
            event.returnValue = {
              err: false,
              msj: 'Generado.'
            }
          })
        })
      } else {
        event.returnValue = {
          err: true,
          msj: 'Error:No se encuentra ninguna Institucion Guardada.'
        }
      }
    }
  })
})

ipcMain.on('constancia_sexto_grado', (event, arg) => {
  Institucion.findById(2).populate('responsable', 'profesion info').exec(function (errI, docT) {
    if (errI) throw (errI)
    else {
      if (docT) {
        Estudiante
        .findOne({ cedula: arg.ci }).populate('info').populate('matricula', '_id anio').exec((err, doc) => {
          if (err) {
            event.returnValue = {
              err: true,
              msj: 'Error:Conección con la BD' + arg.ci
            }
          } else {
            if (doc) {
              if (doc.matricula !== null) {
                if (doc.matricula.anio === 6) {
                  Persona.populate(docT, {path: 'responsable.info', select: 'nombre apellido'}, (errI, docI) => {
                    if (docI.responsable !== null) {
                      var docPdf = {
                        director: {
                          profesion: docI.responsable.profesion,
                          nombre: docI.responsable.info.nombre,
                          apellido: docI.responsable.info.apellido
                        },
                        cod_estadistico: arg.cod,
                        cod_dea: docI.codigoDea,
                        estudiante: {
                          info: {
                            apellidos: doc.info.apellido,
                            nombres: doc.info.nombre,
                            edad: doc.info.edad,
                            cedula: doc.info.cedula,
                            direccion: doc.info.direccion
                          },
                          fechaNacimiento: new Date(doc.fechaNacimiento).toLocaleDateString(),
                          nota: arg.nota
                        },
                        periodo: arg.periodo
                      }
                      var constanciaSextoGrado = require('./pdf/constancia_sexto_grado')
                      constanciaSextoGrado.generar(docPdf)
                      Matricula.findByIdAndUpdate(doc.matricula._id, { $pull: {estudiantes: doc._id} }, (errM, docMatricula) => {
                        if (errM) {
                          event.returnValue = {
                            err: true,
                            msj: 'Error:No se encuentra la matricula del estudiante'
                          }
                        } else {
                          doc.matricula = null
                          doc.save((errSE) => {
                            if (errSE) {
                              event.returnValue = {
                                err: true,
                                msj: 'Error:El estudiante no se elimino de su matricula'
                              }
                            } else {
                              event.returnValue = {
                                err: false,
                                msj: 'Documento generado.'
                              }
                            }
                          })
                        }
                      })
                    } else {
                      event.returnValue = {
                        err: true,
                        msj: 'Error:El director no esta registrado en el sistema, por favor agregelo'
                      }
                    }
                  })
                } else {
                  event.returnValue = {
                    err: true,
                    msj: 'Error:Este estudiante no esta en 6 grado para graduarse.'
                  }
                }
              } else {
                event.returnValue = {
                  err: true,
                  msj: 'Error:Estudiante no matriculado (se retiro o se graduo).'
                }
              }
            } else {
              event.returnValue = {
                err: true,
                msj: 'Error:No se encuentra el Estudiante con Cedula' + arg.ci
              }
            }
          }
        })
      } else {
        event.returnValue = {
          err: true,
          msj: 'Error:No se encuentra ninguna Institucion Guardada'
        }
      }
    }
  })
})

ipcMain.on('constancia_estudio', (event, arg) => {
  Institucion.findById(2).populate('responsable', 'profesion info').exec(function (errI, docT) {
    if (errI) throw (errI)
    else {
      if (docT) {
        Estudiante
        .findOne({ cedula: arg.ci }).populate('info').populate('matricula', '_id anio seccion').exec((err, doc) => {
          if (err) {
            event.returnValue = {
              err: true,
              msj: 'Error:Conección con la BD' + arg.ci
            }
          } else {
            if (doc) {
              if (doc.matricula !== null) {
                Persona.populate(docT, {path: 'responsable.info', select: 'nombre apellido'}, (errI, docI) => {
                  if (docI) {
                    var docPdf = {
                      director: {
                        profesion: docI.responsable.profesion,
                        nombre: docI.responsable.info.nombre,
                        apellido: docI.responsable.info.apellido
                      },
                      cod_estadistico: arg.cod,
                      cod_dea: docI.codigoDea,
                      estudiante: {
                        info: {
                          apellidos: doc.info.apellido,
                          nombres: doc.info.nombre,
                          edad: doc.info.edad,
                          cedula: doc.info.cedula,
                          direccion: doc.info.direccion
                        },
                        anio: doc.matricula.anio,
                        seccion: doc.matricula.seccion,
                        representante: doc.representante,
                        fechaNacimiento: new Date(doc.fechaNacimiento).toLocaleDateString(),
                        nota: arg.nota
                      },
                      anioEscolar: arg.anio
                    }
                    var constanciaEstudio = require('./pdf/constancia_estudio')
                    constanciaEstudio.generar(docPdf)
                    event.returnValue = {
                      err: false,
                      msj: 'Generado.'
                    }
                  } else {
                    event.returnValue = {
                      err: true,
                      msj: 'Error:El director no esta registrado en el sistema, por favor agregelo'
                    }
                  }
                })
              } else {
                event.returnValue = {
                  err: true,
                  msj: 'Error:Estudiante no matriculado (se retiro o se graduo).'
                }
              }
            } else {
              event.returnValue = {
                err: true,
                msj: 'Error:No se encuentra el Estudiante con Cedula' + arg.ci
              }
            }
          }
        })
      } else {
        event.returnValue = {
          err: true,
          msj: 'Error:No se encuentra ninguna Institucion Guardada'
        }
      }
    }
  })
})

ipcMain.on('Constancia_trabajo', (event, arg) => {
  Institucion.findById(2).populate('responsable', 'profesion info dependencia telefono').exec(function (errI, docT) {
    if (errI) throw (errI)
    else {
      if (docT) {
        switch (arg.tipo) {
          case 1:
            Personal.findOne({ codigo: arg.data.cod }).populate('info').exec(function (err, doc) {
              if (err) {
                event.returnValue = {
                  err: true,
                  msj: 'Error al Conectarse con la BD' + arg.ci
                }
              } else {
                if (doc) {
                  if (docT.responsable !== null) {
                    Persona.populate(docT, {path: 'responsable.info', select: 'cedula nombre apellido'}, (errI, docI) => {
                      var docPdf = {
                        director: {
                          cedula: docI.responsable.info.cedula,
                          profesion: docI.responsable.profesion,
                          nombre: docI.responsable.info.nombre,
                          apellido: docI.responsable.info.apellido,
                          dependencia: docI.nombre,
                          telefono: docI.responsable.telefono
                        },
                        cod_dea: docI.codigoDea,
                        personal: {
                          info: {
                            apellido: doc.info.apellido,
                            nombre: doc.info.nombre,
                            edad: doc.info.edad,
                            cedula: doc.info.cedula,
                            direccion: doc.info.direccion
                          },
                          dependencia: doc.dependencia,
                          cargo: doc.cargo,
                          fechaIngreso: new Date(doc.fechaIngreso).toLocaleDateString(),
                          cod_cargo: doc.codigo,
                          turno: arg.data.turno,
                          sueldo: arg.data.sueldo
                        }
                      }
                      var constanciaTrabajo = require('./pdf/constancia_trabajo')
                      constanciaTrabajo.generar(docPdf)

                      event.returnValue = {
                        err: false,
                        msj: 'Se genero el Archivo en su Directorio de Documentos'
                      }
                    })
                  } else {
                    event.returnValue = {
                      err: false,
                      msj: 'El director no esta registrado en el sistema, por favor agregelo'
                    }
                  }
                } else {
                  event.returnValue = {
                    err: true,
                    msj: 'No se encuentra el Docente o Personal con Codigo ' + arg.data.cod
                  }
                }
              }
            })
            break
          case 2:
            Docente
            .findOne({ codigo: arg.data.cod }).populate('info').exec(function (err, doc) {
              if (err) {
                event.returnValue = {
                  err: true,
                  msj: 'Error al Conectarse con la BD' + arg.data.ci
                }
              } else {
                if (doc) {
                  if (docT.responsable !== null) {
                    Persona.populate(docT, {path: 'responsable.info', select: 'cedula nombre apellido'}, (errP, docI) => {
                      var docPdf = {
                        director: {
                          cedula: docI.responsable.info.cedula,
                          profesion: docI.responsable.profesion,
                          nombre: docI.responsable.info.nombre,
                          apellido: docI.responsable.info.apellido,
                          dependencia: docI.nombre,
                          telefono: docI.responsable.telefono
                        },
                        cod_dea: docI.codigoDea,
                        personal: {
                          info: {
                            apellido: doc.info.apellido,
                            nombre: doc.info.nombre,
                            edad: doc.info.edad,
                            cedula: doc.info.cedula,
                            direccion: doc.info.direccion
                          },
                          dependencia: docI.nombre,
                          cargo: doc.cargo,
                          fechaIngreso: new Date(doc.fechaIngreso).toLocaleDateString(),
                          cod_cargo: doc.codigo,
                          turno: arg.data.turno,
                          sueldo: arg.data.sueldo
                        }
                      }
                      var constanciaTrabajo = require('./pdf/constancia_trabajo')
                      constanciaTrabajo.generar(docPdf)

                      event.returnValue = {
                        err: false,
                        msj: 'Se genero el Archivo en su Directorio de Documentos'
                      }
                    })
                  } else {
                    event.returnValue = {
                      err: false,
                      msj: 'El director no esta registrado en el sistema, por favor agregelo'
                    }
                  }
                } else {
                  event.returnValue = {
                    err: true,
                    msj: 'No se encuentra el Docente o Personal con Codigo ' + arg.data.cod
                  }
                }
              }
            })
            break
          default:
            event.returnValue = {
              err: true,
              msj: 'tipo invalido '
            }
        }
      } else {
        event.returnValue = {
          err: true,
          msj: 'Esto es critico contacte con Rafael Rojas'
        }
      }
    }
  })
})

ipcMain.on('getUser', (event, arg) => {
  mongoose.connect('tingodb://data', (errC) => {
    User.findOne({name: arg.name}, (err, docUser) => {
      if (err) throw (err)
      else {
        if (docUser) {
          if (docUser.pass === arg.pass) {
            event.returnValue = {
              err: false,
              msj: ''
            }
          } else {
            event.returnValue = {
              err: true,
              msj: 'Constraseña Incorrecta'
            }
          }
        } else {
          event.returnValue = {
            err: true,
            msj: 'Usuario no Registrado'
          }
        }
      }
    })
  })
})

ipcMain.on('Iniciar', (event, arg) => {
  mongoose.connect('tingodb://data', function (err) {
    if (err) {
      throw err
    } else {
      Institucion
      .where('codigoDependencia').count(function (err, len) {
        if (err) throw (err)
        else {
          if (len) {
            event.returnValue = {
              err: false,
              msj: 'Data Cargada'
            }
          } else {
            event.returnValue = {
              err: true,
              msj: 'Iniciar el Sistema.'
            }
          }
        }
      })
    }
  })
})

ipcMain.on('postInstitucion', (event, arg) => {
  mongoose.connect('tingodb://data', function (err) {
    if (err) {
      throw err
    } else {
      User.create({
        name: 'root',
        pass: 'root'
      })
      Persona.create({
        nombre: arg.responsable.nombre,
        apellido: arg.responsable.apellido,
        cedula: arg.responsable.cedula,
        edad: arg.responsable.edad
      }, function (errP, docPersona) {
        if (errP) {
          event.returnValue = {
            err: true,
            msj: 'Esta persona ya existe'
          }
        } else {
          Personal.create({
            codigo: 'D001',
            info: docPersona,
            profesion: arg.responsable.profesion,
            cargo: arg.responsable.cargo,
            telefono: arg.responsable.telefono,
            dependencia: arg.nombre,
            fechaIngreso: arg.fechaIngreso
          }, (errPl, docPersonal) => {
            if (errPl) {
              docPersona.remove()
              event.returnValue = {
                err: true,
                msj: 'Imposible crear el Director'
              }
            } else {
              Institucion.create({
                codigoDependencia: arg.codigoDependencia,
                nombre: arg.nombre,
                codigoDea: arg.codigoDea,
                responsable: docPersonal
              }, function (errI, docInstitucion) {
                if (errI) {
                  docPersonal.remove()
                  docPersona.remove()
                  event.returnValue = {
                    err: true,
                    msj: 'Imposible crear esta Institucion.'
                  }
                } else {
                  event.returnValue = {
                    err: false,
                    msj: 'Creado la Institucion ' + arg.nombre
                  }
                }
              })
            }
          })
        }
      })
    }
  })
})

ipcMain.on('get', (event, arg) => {
  mongoose.connect('tingodb://data', function (err) {
    if (err) throw err
    findData()
  })

  function findData () {
    switch (arg.tipo) {
      case 0:
        User.find({}, (errU, docsUsers) => {
          if (errU) throw (errU)
          else {
            event.returnValue = {
              err: false,
              docs: docsUsers
            }
          }
        })
        break
      case 1:
        Matricula.find({}, (errM, docsMatricula) => {
          if (errM) {
            event.returnValue = {
              err: true,
              msj: 'No a creado matriculas en el sistema.'
            }
          } else {
            event.returnValue = {
              err: false,
              docs: docsMatricula
            }
          }
        })
        break
      case 2:
        Matricula.find({docente: null}, (errM, docsMatricula) => {
          if (errM) {
            event.returnValue = {
              err: true,
              msj: 'No a creado matriculas en el sistema.'
            }
          } else {
            event.returnValue = {
              err: false,
              docs: docsMatricula
            }
          }
        })
        break
      case 3:
        Estudiante.find({}).populate('info').populate('matricula', 'name').exec((errE, docsEstudiantes) => {
          if (errE) {
            event.returnValue = {
              err: true,
              msj: 'Error conexion'
            }
          } else {
            event.returnValue = {
              err: false,
              docs: docsEstudiantes
            }
          }
        })
        break
      case 4:
        Docente.find({}).populate('info').populate('matricula', 'name').exec((errD, docsDocentes) => {
          if (errD) {
            event.returnValue = {
              err: true,
              msj: 'Error conexion'
            }
          } else {
            event.returnValue = {
              err: false,
              docs: docsDocentes
            }
          }
        })
        break
      case 5:
        Matricula.find({}).populate('docente', 'info codigo matricula').populate('estudiantes', 'genero').exec((errM, docsMatricula) => {
          if (errM) throw (errM)
          else {
            Persona.populate(docsMatricula, { path: 'docente.info', select: 'nombre apellido cedula' }, (errP, docsFinalMatricula) => {
              if (errP) throw (errP)
              else {
                event.returnValue = {
                  err: false,
                  docs: docsFinalMatricula
                }
              }
            })
          }
        })
        break
      case 6:
        Personal.find({}).populate('info').exec((errP, docsPersonal) => {
          if (errP) throw (errP)
          else {
            event.returnValue = {
              err: false,
              docs: docsPersonal
            }
          }
        })
        break
      default:
    }
  }
})

ipcMain.on('remove', (event, arg) => {
  switch (arg.tipo) {
    case 0:
      User.findByIdAndRemove(arg.data._id, (err) => {
        if (err) {
          event.returnValue = {
            err: true,
            msj: 'Error remove User'
          }
        } else {
          event.returnValue = {
            err: false,
            msj: 'Eliminado ' + arg.name
          }
        }
      })
      break
    case 1:
      Persona.findByIdAndRemove(arg.data.info._id, (errP, docPersona) => {
        Estudiante.findByIdAndRemove(arg.data._id).populate('matricula').exec((err, doc) => {
          if (err) {
            event.returnValue = {
              err: true,
              msj: 'Error en el query'
            }
          } else {
            if (doc.matricula) {
              Matricula.findById(doc.matricula._id, (errM, docMatricula) => {
                docMatricula.estudiantes.pull(doc._id)
                docMatricula.save()
              })
            }
            event.returnValue = {
              err: false,
              msj: 'Eliminado ' + arg.name
            }
          }
        })
      })
      break
    case 2:
      Matricula.findByIdAndRemove(arg.data._id).populate('estudiantes').exec((err, docMatricula) => {
        if (err) {
          event.returnValue = {
            err: true,
            msj: 'Error remove Matricula'
          }
        } else {
          docMatricula.estudiantes.forEach(function (e) {
            Estudiante.findById(e._id, (errE, docEstudiante) => {
              docEstudiante.matricula = null
              docEstudiante.save()
            })
          })
          if (arg.data.docente._id === '') {
            event.returnValue = {
              err: false,
              msj: 'Eliminado ' + arg.name
            }
          } else {
            Docente.findById(arg.data.docente._id, (errD, docDocente) => {
              if (errD) {
                event.returnValue = {
                  err: true,
                  msj: 'error docente re-asined'
                }
              } else {
                docDocente.matricula = null
                docDocente.save()
              }
            })
          }
        }
      })
      break
    case 3:
      Matricula.findById(arg.data._id).populate('estudiantes').exec((err, docMatricula) => {
        if (err) {
          event.returnValue = {
            err: true,
            msj: 'error no found Matricula'
          }
        } else {
          docMatricula.estudiantes.forEach(function (e) {
            Estudiante.findByIdAndUpdate(e._id, {$set: { matricula: null }}, (errE, docEstudiante) => {
            })
          })
          docMatricula.estudiantes = []
          docMatricula.save()
          event.returnValue = {
            err: false,
            msj: 'Eliminado ' + arg.name
          }
        }
      })
      break
    case 4:
      Persona.findById(arg.data.info._id, (errP, docPersona) => {
        if (errP) {
          event.returnValue = {
            err: false,
            msj: 'Persona error'
          }
        } else {
          Personal.findById(arg.data._id, (errPl, docPersonal) => {
            if (errPl) {
              event.returnValue = {
                err: false,
                msj: 'Personal error'
              }
            } else {
              Institucion.findById(2).populate('responsable personalReponsables').exec((errI, docInstitucion) => {
                if (errI) {
                  event.returnValue = {
                    err: false,
                    msj: 'Institucion error'
                  }
                } else {
                  if (docInstitucion.responsable !== null) {
                    if (docInstitucion.responsable.codigo === docPersonal.codigo) {
                      docInstitucion.responsable = null
                    }
                  } else {
                    if (docInstitucion.personalReponsables.length !== 0) {
                      docInstitucion.personalReponsables.pull(docPersonal._id)
                    }
                  }
                  docInstitucion.save(() => {
                    docPersonal.remove(() => {
                      docPersona.remove(() => {
                        event.returnValue = {
                          err: false
                        }
                      })
                    })
                  })
                }
              })
            }
          })
        }
      })
      break
    case 5:
      Persona.findById(arg.data.info._id, (errP, docPersona) => {
        if (errP) {
          event.returnValue = {
            err: true,
            msj: ''
          }
        } else {
          Docente.findById(arg.data._id).populate('matricula').exec((errD, docDocente) => {
            if (errD) {
              event.returnValue = {
                err: true,
                msj: 'error Docente not found'
              }
            } else {
              if (docDocente.matricula !== null) {
                Matricula.findById(docDocente.matricula._id, (errM, docMatricula) => {
                  if (errM) {
                    event.returnValue = {
                      err: true,
                      msj: 'error Matricula not found'
                    }
                  } else {
                    docMatricula.docente = null
                    docMatricula.save(() => {
                      docDocente.remove(() => {
                        docPersona.remove(() => {
                          event.returnValue = {
                            err: false
                          }
                        })
                      })
                    })
                  }
                })
              } else {
                docDocente.remove(() => {
                  docPersona.remove(() => {
                    event.returnValue = {
                      err: false
                    }
                  })
                })
              }
            }
          })
        }
      })
      break
    default:
  }
})

ipcMain.on('put', (event, arg) => {
  switch (arg.tipo) {
    case 0:
      User.findByIdAndUpdate(arg.data._id, arg.data, (err, doc) => {
        if (err) throw (err)
        else {
          event.returnValue = {
            err: false,
            msj: 'Actualizado ' + arg.name
          }
        }
      })
      break
    case 1:
      Persona.findByIdAndUpdate(arg.data.info._id, arg.data.info, (err, docInfo) => {
        if (err) throw (err)
        else {
          if (arg.data.matricula._id === '') {
            Estudiante.findById(arg.data._id).populate('matricula').exec((errE, docEstudiante) => {
              if (err) {
                event.returnValue = {
                  err: true,
                  msj: 'Error:Estudiante no registrado'
                }
              } else {
                if (arg.data.matricula.name !== '') {
                  Matricula.findOne({name: arg.data.matricula.name}, (errM, docNMatricula) => {
                    if (errM) {
                      docEstudiante.cedula = arg.data.info.cedula
                      docEstudiante.genero = arg.data.genero
                      docEstudiante.representante = arg.data.representante
                      docEstudiante.matricula = null
                      docEstudiante.save()
                      event.returnValue = {
                        err: true,
                        msj: 'Error:No existe ' + arg.data.matricula.name
                      }
                    } else {
                      docNMatricula.estudiantes.push(docEstudiante._id)
                      docEstudiante.matricula = docNMatricula
                      docEstudiante.cedula = arg.data.info.cedula
                      docEstudiante.genero = arg.data.genero
                      docEstudiante.representante = arg.data.representante
                      docNMatricula.save()
                      docEstudiante.save()
                      event.returnValue = {
                        err: false,
                        msj: 'En proceso '
                      }
                    }
                  })
                } else {
                  docEstudiante.cedula = arg.data.info.cedula
                  docEstudiante.genero = arg.data.genero
                  docEstudiante.representante = arg.data.representante
                  docEstudiante.save()
                  event.returnValue = {
                    err: false,
                    msj: 'En proceso '
                  }
                }
              }
            })
          } else {
            Estudiante.findById(arg.data._id).populate('matricula').exec((errE, docEstudiante) => {
              if (err) {
                event.returnValue = {
                  err: true,
                  msj: 'Error estudiante no found'
                }
              } else {
                if (docEstudiante.matricula.name !== arg.data.matricula.name) {
                  Matricula.findByIdAndUpdate(docEstudiante.matricula._id, {$pull: {estudiantes: docEstudiante._id}}, (errM, docMatricula) => {
                    Matricula.findOne({name: arg.data.matricula.name}, (errM, docNMatricula) => {
                      if (errM) {
                        docEstudiante.cedula = arg.data.info.cedula
                        docEstudiante.genero = arg.data.genero
                        docEstudiante.representante = arg.data.representante
                        docEstudiante.matricula = null
                        docEstudiante.save()
                        event.returnValue = {
                          err: true,
                          msj: 'Error Matricuala not found'
                        }
                      } else {
                        docNMatricula.estudiantes.push(docEstudiante._id)
                        docEstudiante.matricula = docNMatricula
                        docEstudiante.cedula = arg.data.info.cedula
                        docEstudiante.genero = arg.data.genero
                        docEstudiante.representante = arg.data.representante
                        docNMatricula.save()
                        docEstudiante.save()
                        event.returnValue = {
                          err: false,
                          msj: 'En proceso '
                        }
                      }
                    })
                  })
                } else {
                  docEstudiante.cedula = arg.data.info.cedula
                  docEstudiante.genero = arg.data.genero
                  docEstudiante.representante = arg.data.representante
                  docEstudiante.save()
                  event.returnValue = {
                    err: false,
                    msj: 'En proceso '
                  }
                }
              }
            })
          }
        }
      })
      break
    case 2:
      Matricula.findById(arg.data._id).exec((err, docMatricula) => {
        if (err) {
          event.returnValue = {
            err: true,
            msj: 'Error Matricula not found '
          }
        } else {
          docMatricula.name = arg.data.name
          docMatricula.anio = parseInt(arg.data.name[0])
          docMatricula.seccion = arg.data.name[2]
          docMatricula.turno = arg.data.turno
          docMatricula.save((errM) => {
            if (errM) {
              event.returnValue = {
                err: true,
                msj: 'Ya debe existir una matricula con este' + arg.data.name
              }
            } else {
              event.returnValue = {
                err: false
              }
            }
          })
        }
      })
      break
    case 3:
      Persona.findById(arg.data.info._id, (errP, docPersona) => {
        if (errP) {
          event.returnValue = {
            err: true,
            msj: 'no existe la persona'
          }
        } else {
          docPersona.cedula = arg.data.info.cedula
          docPersona.nombre = arg.data.info.nombre
          docPersona.apellido = arg.data.info.apellido
          docPersona.edad = arg.data.info.edad
          docPersona.direccion = arg.data.info.direccion
          docPersona.save((errSp) => {
            if (errSp) {
              event.returnValue = {
                err: true,
                msj: 'Imposible guardar la persona'
              }
            } else {
              Personal.findById(arg.data._id, (err, docPersonal) => {
                if (err) {
                  event.returnValue = {
                    err: true,
                    msj: 'no existe este personal'
                  }
                } else {
                  docPersonal.cargo = arg.data.cargo
                  docPersonal.telefono = arg.data.telefono
                  docPersonal.profesion = arg.data.profesion
                  docPersonal.codigo = arg.data.codigo
                  docPersonal.fechaIngreso = arg.data.fechaIngreso
                  docPersonal.dependencia = arg.data.dependencia
                  docPersonal.save((errSPl) => {
                    if (errSPl) {
                      event.returnValue = {
                        err: true,
                        msj: 'Imposible guardar el personal'
                      }
                    } else {
                      event.returnValue = {
                        err: false
                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
      break
    case 4:
      Persona.findById(arg.data.info._id, (errP, docPersona) => {
        if (errP) {
          event.returnValue = {
            err: true,
            msj: 'error Persona no found'
          }
        } else {
          docPersona.cedula = arg.data.info.cedula
          docPersona.nombre = arg.data.info.nombre
          docPersona.apellido = arg.data.info.apellido
          docPersona.edad = arg.data.info.edad
          docPersona.direccion = arg.data.info.direccion
          Docente.findById(arg.data._id).populate('matricula', '_id name').exec((errD, docDocente) => {
            if (errD) {
              event.returnValue = {
                err: true,
                msj: 'Error docente no found'
              }
            } else {
              if (docDocente.matricula !== null) {
                /* Tiene Matricula */
                if (docDocente.matricula.name !== arg.data.matricula.name) {
                  Matricula.findOne({ name: arg.data.matricula.name }).populate('docente', '_id codigo').exec((errMn, docMatriculaN) => {
                    if (errMn) {
                      event.returnValue = {
                        err: true
                      }
                    } else {
                      if (docMatriculaN.docente !== null) {
                        /* Editar la Matricula teng ao no tenga docente */
                        Matricula.findById(docDocente.matricula._id).populate('docente', '_id').exec((errMO, docMatriculaO) => {
                          if (errMO) {
                            event.returnValue = {
                              err: true
                            }
                          } else {
                            docMatriculaO.docente = null
                            docMatriculaO.save((errSMO) => {
                              if (errSMO) {
                                event.returnValue = {
                                  err: true
                                }
                              } else {
                                Docente.findById(docMatriculaN.docente._id, (errDo, docDocenteO) => {
                                  if (errDo) {
                                    event.returnValue = {
                                      err: true
                                    }
                                  } else {
                                    docDocenteO.matricula = null
                                    docDocenteO.save((errSDO) => {
                                      docMatriculaN.docente = docDocente
                                      docMatriculaN.save((errSMN) => {
                                        if (errSMN) {
                                          event.returnValue = {
                                            err: true
                                          }
                                        } else {
                                          docDocente.matricula = docMatriculaN
                                          /* Sobreescribir data docente */
                                          docDocente.codigo = arg.data.codigo
                                          docDocente.cargo = arg.data.cargo
                                          docDocente.telefono = arg.data.telefono
                                          docDocente.save((errSD) => {
                                            if (errSD) {
                                              event.returnValue = {
                                                err: true
                                              }
                                            } else {
                                              /* Sobreescribir Persona */
                                              docPersona.cedula = arg.data.info.cedula
                                              docPersona.nombre = arg.data.info.nombre
                                              docPersona.apellido = arg.data.info.apellido
                                              docPersona.edad = arg.data.info.edad
                                              docPersona.direccion = arg.data.info.direccion
                                              docPersona.save((errSP) => {
                                                if (errSP) {
                                                  event.returnValue = {
                                                    err: true
                                                  }
                                                } else {
                                                  event.returnValue = {
                                                    err: false
                                                  }
                                                }
                                              })
                                            }
                                          })
                                        }
                                      })
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      } else {
                        /* Editar la Matricula tenga o no tenga docente */
                        Matricula.findById(docDocente.matricula._id).populate('docente', '_id').exec((errMO, docMatriculaO) => {
                          if (errMO) {
                            event.returnValue = {
                              err: true
                            }
                          } else {
                            docMatriculaO.docente = null
                            docMatriculaO.save((errSMO) => {
                              if (errSMO) {
                                event.returnValue = {
                                  err: true
                                }
                              } else {
                                docMatriculaN.docente = docDocente
                                docMatriculaN.save((errSMN) => {
                                  if (errSMN) {
                                    event.returnValue = {
                                      err: true
                                    }
                                  } else {
                                    docDocente.matricula = docMatriculaN
                                    /* Sobreescribir data docente */
                                    docDocente.codigo = arg.data.codigo
                                    docDocente.cargo = arg.data.cargo
                                    docDocente.telefono = arg.data.telefono
                                    docDocente.save((errSD) => {
                                      if (errSD) {
                                        event.returnValue = {
                                          err: true
                                        }
                                      } else {
                                        /* Sobreescribir Persona */
                                        docPersona.cedula = arg.data.info.cedula
                                        docPersona.nombre = arg.data.info.nombre
                                        docPersona.apellido = arg.data.info.apellido
                                        docPersona.edad = arg.data.info.edad
                                        docPersona.direccion = arg.data.info.direccion
                                        docPersona.save((errSP) => {
                                          if (errSP) {
                                            event.returnValue = {
                                              err: true
                                            }
                                          } else {
                                            event.returnValue = {
                                              err: false
                                            }
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                } else {
                  docDocente.codigo = arg.data.codigo
                  docDocente.cargo = arg.data.cargo
                  docDocente.telefono = arg.data.telefono
                  docDocente.save((errSD) => {
                    if (errSD) {
                      event.returnValue = {
                        err: true
                      }
                    } else {
                      /* Sobreescribir Persona */
                      docPersona.cedula = arg.data.info.cedula
                      docPersona.nombre = arg.data.info.nombre
                      docPersona.apellido = arg.data.info.apellido
                      docPersona.edad = arg.data.info.edad
                      docPersona.direccion = arg.data.info.direccion
                      docPersona.save((errSP) => {
                        if (errSP) {
                          event.returnValue = {
                            err: true
                          }
                        } else {
                          event.returnValue = {
                            err: false
                          }
                        }
                      })
                    }
                  })
                }
              } else {
                /* No Tiene Matricula */
                Matricula.findOne({ name: arg.data.matricula.name }).populate('docente', '_id codigo').exec((errMn, docMatriculaN) => {
                  if (errMn) {
                    event.returnValue = {
                      err: true
                    }
                  } else {
                    if (docMatriculaN.docente !== null) {
                      /* Editar la Matricula teng ao no tenga docente */
                      Docente.findById(docMatriculaN.docente._id, (errDo, docDocenteO) => {
                        if (errDo) {
                          event.returnValue = {
                            err: true
                          }
                        } else {
                          docDocenteO.matricula = null
                          docDocenteO.save((errSDO) => {
                            docMatriculaN.docente = docDocente
                            docMatriculaN.save((errSMN) => {
                              if (errSMN) {
                                event.returnValue = {
                                  err: true
                                }
                              } else {
                                docDocente.matricula = docMatriculaN
                                /* Sobreescribir data docente */
                                docDocente.codigo = arg.data.codigo
                                docDocente.cargo = arg.data.cargo
                                docDocente.telefono = arg.data.telefono
                                docDocente.save((errSD) => {
                                  if (errSD) {
                                    event.returnValue = {
                                      err: true
                                    }
                                  } else {
                                    /* Sobreescribir Persona */
                                    docPersona.cedula = arg.data.info.cedula
                                    docPersona.nombre = arg.data.info.nombre
                                    docPersona.apellido = arg.data.info.apellido
                                    docPersona.edad = arg.data.info.edad
                                    docPersona.direccion = arg.data.info.direccion
                                    docPersona.save((errSP) => {
                                      if (errSP) {
                                        event.returnValue = {
                                          err: true
                                        }
                                      } else {
                                        event.returnValue = {
                                          err: false
                                        }
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          })
                        }
                      })
                    } else {
                      /* Editar la Matricula teng ao no tenga docente */
                      docMatriculaN.docente = docDocente
                      docMatriculaN.save((errSMN) => {
                        if (errSMN) {
                          event.returnValue = {
                            err: true
                          }
                        } else {
                          docDocente.matricula = docMatriculaN
                          /* Sobreescribir data docente */
                          docDocente.codigo = arg.data.codigo
                          docDocente.cargo = arg.data.cargo
                          docDocente.telefono = arg.data.telefono
                          docDocente.save((errSD) => {
                            if (errSD) {
                              event.returnValue = {
                                err: true
                              }
                            } else {
                              /* Sobreescribir Persona */
                              docPersona.cedula = arg.data.info.cedula
                              docPersona.nombre = arg.data.info.nombre
                              docPersona.apellido = arg.data.info.apellido
                              docPersona.edad = arg.data.info.edad
                              docPersona.direccion = arg.data.info.direccion
                              docPersona.save((errSP) => {
                                if (errSP) {
                                  event.returnValue = {
                                    err: true
                                  }
                                } else {
                                  event.returnValue = {
                                    err: false
                                  }
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
      break
    default:
  }
})

ipcMain.on('cambioDirector', (event, arg) => {
  Institucion.findById(2).populate('responsable').exec((err, docInstitucion) => {
    if (err) {
      event.returnValue = {
        err: true,
        msj: ''
      }
    } else {
      if (docInstitucion.responsable) {
        Personal.findById(docInstitucion.responsable._id, (errP, docPersonal) => {
          if (errP) {
            event.returnValue = {
              err: true,
              msj: ''
            }
          } else {
            docPersonal.cargo = 'ExDirector(a)'
            docPersonal.codigo = '_D00' + docPersonal._id
            docPersonal.save()
          }
        })
      }
      Personal.findById(arg.data._id, (errP, docDirector) => {
        if (errP) {
          event.returnValue = {
            err: true,
            msj: ''
          }
        } else {
          docDirector.cargo = 'Director(a)'
          docDirector.dependencia = docInstitucion.nombre
          docDirector.codigo = 'D001'
          docDirector.save()
          docInstitucion.responsable = docDirector
          docInstitucion.save()
          event.returnValue = {
            err: false,
            dependencia: docInstitucion.nombre
          }
        }
      })
    }
  })
})

ipcMain.on('agregarContacto', (event, arg) => {
  Institucion.findById(2, (err, docInstitucion) => {
    if (err) {
      event.returnValue = {
        err: true,
        msj: ''
      }
    } else {
      docInstitucion.personalReponsables.push(arg.data._id)
      docInstitucion.save()
      event.returnValue = {
        err: false
      }
    }
  })
})

ipcMain.on('resetearContacto', (event, arg) => {
  Institucion.findById(2, (err, docInstitucion) => {
    if (err) {
      event.returnValue = {
        err: true,
        msj: ''
      }
    } else {
      docInstitucion.personalReponsables = []
      docInstitucion.save()
      event.returnValue = {
        err: false
      }
    }
  })
})

ipcMain.on('buscar_matricula', (event, arg) => {
  Matricula.findOne({ name: arg.matricula }).populate('estudiantes').exec((err, docs) => {
    if (err) {
      event.returnValue = {
        err: true,
        msj: 'No existe ' + arg.matricula + 'verifique...'
      }
    } else {
      Persona.populate(docs, {path: 'estudiantes.info', select: 'nombre apellido'}, function (errT, docT) {
        event.returnValue = {
          err: false,
          data: docT
        }
      })
    }
  })
})
