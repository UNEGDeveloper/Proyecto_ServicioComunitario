<template lang="html">
  <div >
      <v-container>
        <v-layout row wrap justify-center class="text-xs-center">
          <v-flex xs10 md8 >
            <transition name="fade">
              <div v-if="inicio" class="pt-5">
                  <div class="pt-5">
                    <div class="pt-5">
                      <div class="pt-5 ">
                        <div class="pt-5 ">
                          <v-progress-circular indeterminate v-bind:size="70" v-bind:width="4" class="blue--text"></v-progress-circular>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div v-else class="text-xs-center pt-5">
                <v-stepper v-model="e1" class="grey lighten-5  elevation-10" >
                  <v-stepper-header>
                    <v-stepper-step step="1" :complete="e1 > 1">Saludo</v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step step="2" :complete="e1 > 2">Informacion de la Institución</v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step step="3">Codigos de la Institución</v-stepper-step>
                  </v-stepper-header>
                  <v-stepper-content step="1">
                    <v-card class="grey lighten-3 z-depth-1 mb-5">
                      <v-card-text class="title">
                        <blockquote> 
                        Bienvenid@ sea usted a nuestro sistema de administración estudiantil. <br>
                        <br>
                        Esta aqui para configurar su aplicación con los datos basicos de la Institución <br>
                        <br>
                         Datos del Director (a) y Codigos que usa la misma. <br>
                        <br>
                        Por favor precione Continuar y rellene todos los campos acontinuacion...
                         </blockquote> 
                      </v-card-text>
                    </v-card>
                    <v-btn primary @click.native="e1 = 2" light>Continuar</v-btn>
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <v-card class="grey lighten-3 z-depth-1 mb-5" >
                      <v-card-text>
                        <v-subheader>Información del Director (a)</v-subheader>
                        <v-layout row-sm column child-flex-sm>
                          <v-flex md12>
                            <v-text-field v-model='Institucion.responsable.cedula' v-bind:rules="reglas" min="7" max="10" maxlength="10" counter label="Cedula del Director (a)" required />
                            <v-text-field v-model='Institucion.responsable.nombre' min="4" max="15" maxlength="15" counter label="Nombre del Director (a)" required />
                            <v-text-field v-model='Institucion.responsable.apellido' min="4" max="15" maxlength="15" counter label="Apellido del Director (a) " required />
                          </v-flex>
                          <v-flex md12>
                            <v-text-field v-model='Institucion.responsable.edad'  v-bind:rules="reglas" min="2" max="2" maxlength="2" counter label="Edad del Director (a)" required />
                            <v-text-field v-model='Institucion.responsable.profesion' min="2" max="5" maxlength="5" counter label="Profesion del Director (a)" required />
                            <v-text-field v-model='Institucion.responsable.telefono' min="10" max="11" maxlength="11" counter label="Telefono del Director (a)" required />
                            <v-dialog
                              v-model="menu"
                              lazy
                            >
                              <v-text-field
                                slot="activator"
                                label="Fecha Ingreso"
                                v-model="Institucion.fechaIngreso"
                                prepend-icon="event"
                                readonly
                                required
                              ></v-text-field>
                              <v-date-picker class="grey lighten-1" v-model="Institucion.fechaIngreso"  dark scrollable no-title actions>
                              </v-date-picker>
                            </v-dialog>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-btn primary @click.native="e1 = 1" light>Volver</v-btn>
                    <v-btn primary @click.native="e1 = 3" light :disabled="Institucion.responsable.cedula.length < 7 || Institucion.responsable.nombre.length < 4
                    || Institucion.responsable.apellido.length < 4 || Institucion.responsable.edad.length < 2 || Institucion.responsable.telefono.length < 10 || Institucion.responsable.profesion.length < 2 || Institucion.fechaIngreso.length === 0 || errores">Continuar</v-btn>
                  </v-stepper-content>
                  <v-stepper-content step="3">
                    <v-card class="grey lighten-3 z-depth-1 mb-5">
                      <v-card-text>
                        <v-subheader class="title">Información de la Institución</v-subheader>
                        <v-layout row-sm column child-flex-sm>
                          <v-flex md12>
                            <v-text-field v-model='Institucion.codigoDependencia' max="20" maxlength="20" counter label="Codigo de Dependencia" required />
                            </v-flex>
                          <v-flex md12>
                            <v-text-field v-model='Institucion.codigoDea' max="20" maxlength="20" counter label="Codigo DEA" required />
                          </v-flex>
                        </v-layout>
                        <v-flex xs12 md6 offset-md3>
                          <v-text-field v-model='Institucion.nombre' max="20" maxlength="20" counter label="Nombre de la Institución" required />
                        </v-flex>
                      </v-card-text>
                    </v-card>
                    <v-btn primary @click.native="e1 = 2" light>Volver</v-btn>
                    <v-btn primary :disabled="Institucion.nombre.length < 8 || Institucion.codigoDependencia.length === 0 || Institucion.codigoDea.length === 0" @click.native="guardar()" light>Continuar</v-btn>
                  </v-stepper-content>
                </v-stepper>
              </div>
            </transition>
          </v-flex>
        </v-layout>
        <v-snackbar
          :timeout="3000"
          :bottom="true"
          :right="true"
          v-model="sb"
        >
          {{msg}}
        </v-snackbar>
      </v-container>
</div>
</template>

<script>
export default {
  data () {
    return {
      inicio: true,
      show: true,
      e1: 0,
      menu: false,
      sb: false,
      msg: '',
      Institucion: {
        responsable: {
          cedula: '',
          nombre: '',
          apellido: '',
          edad: '',
          profesion: '',
          cargo: 'Director(a)',
          telefono: ''
        },
        codigoDependencia: '',
        codigoDea: '',
        nombre: '',
        fechaIngreso: ''
      },
      reglas: [
        (s) => {
          if (!isNaN(s)) {
            this.errores = false
            return true
          } else {
            this.errores = true
            return 'No ingrese simbolos o letras solo numeros'
          }
        }
      ],
      errores: false
    }
  },
  methods: {
    guardar () {
      this.inicio = true
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          var res = ipcRenderer.sendSync('postInstitucion', vm.Institucion)
          if (res.err) {
            vm.sb = true
            vm.msg = res.msj
            vm.e1 = 2
          } else {
            vm.inicio = true
            vm.sb = true
            vm.msg = res.msj
            setTimeout(function () {
              vm.$router.push('/Bienvenida')
            }, 3000)
          }
        })
      }
      enviar()
    }
  },
  created () {
    var vm = this
    function enviar () {
      return new Promise(function () {
        setTimeout(function () {
          var {ipcRenderer} = require('electron')
          var res = ipcRenderer.sendSync('Iniciar')
          if (res.err) {
            vm.inicio = false
            vm.sb = true
            vm.msg = res.msj
          } else {
            vm.sb = true
            vm.msg = res.msj
            setTimeout(function () {
              vm.$router.push('/Bienvenida')
            }, 1000)
          }
        }, 1000)
      })
    }
    enviar()
  }
}
</script>

<style lang="css" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .4s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
