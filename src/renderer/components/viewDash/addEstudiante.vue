<template lang="html">
  <div class="pa-5">
    <v-layout row wrap justify-center>
      <v-flex xs12 md6 class="">
        <v-card class="elevation-8  ">
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <v-subheader>Información del Estudiante</v-subheader>
              <v-text-field v-model='Estudiante.ci' min="7" max="15" maxlength="15" counter label="Cedula del Estudiante"
              v-bind:rules="reglas" required />
              <v-text-field v-model="Estudiante.name" max="20" maxlength="20" counter label="Nombre del Estudiante"  />
              <v-text-field v-model="Estudiante.lastname" max="20" maxlength="20" counter label="Apellido del Estudiante"  />
              <v-text-field v-model="Estudiante.edad" min="1" max="2" maxlenth="2" counter label="Edad del Estudiante" v-bind:rules="reglas" />
              <v-text-field v-model="Estudiante.dir" max="30" maxlength="30" counter label="Dirección"  />
              <v-text-field v-model="Estudiante.genero" max="1" maxlength="1" counter label="Genero"  />
              <v-btn-dropdown
                label="Año Escolar y Sección"
                v-bind:options="secciones"
                v-model="Estudiante.matricula"
                overflow
              ></v-btn-dropdown>
              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="menu"
                transition="v-scale-transition"
                offset-y
                :nudge-left="40"
              >
                <v-text-field
                  slot="activator"
                  label="Fecha Nacimiento"
                  v-model="Estudiante.fechaNacimiento"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="Estudiante.fechaNacimiento" no-title scrollable actions>
                  <template scope="{ save, cancel }">
                    <v-card-row actions>
                      <v-btn flat primary @click.native="cancel()">Cancelar</v-btn>
                      <v-btn flat primary @click.native="save()">Guardar</v-btn>
                    </v-card-row>
                  </template>
                </v-date-picker>
              </v-menu>
              <v-subheader>Información del Representante</v-subheader>
              <v-text-field v-model="Estudiante.rl.ci" v-bind:rules="reglas" min="7" max="10" maxlength="10" counter label="Cedula del Representante" required  />
              <v-text-field v-model="Estudiante.rl.name" max="20" maxlength="20" counter label="Nombre del Representante"  />
              <v-text-field v-model="Estudiante.rl.lastname" max="20" maxlength="20" counter label="Apellido del Representante"  />
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="mr-3" secondary light raise @click.native="limpiar">Limpiar</v-btn>

          <v-btn class="mr-3"  primary light raise :disabled="Estudiante.ci.length < 7 || Estudiante.rl.ci.length < 7 || Estudiante.ci === Estudiante.rl.ci || Estudiante.fechaNacimiento.length === 0 || errores" @click.native="guardar">Guardar</v-btn>

        </v-card-row>
      </v-card>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      Estudiante: {
        tipo: 2,
        ci: '',
        name: '',
        lastname: '',
        edad: 5,
        dir: '',
        matricula: '',
        genero: 'M',
        rl: {
          ci: '',
          name: '',
          lastname: ''
        },
        fechaNacimiento: ''
      },
      sb: false,
      msg: '',
      secciones: [],
      menu: false,
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
    limpiar () {
      this.Estudiante = {
        tipo: 2,
        ci: '',
        name: '',
        lastname: '',
        edad: 5,
        dir: '',
        matricula: '',
        genero: 'M',
        rl: {
          ci: 'V',
          name: '',
          lastname: ''
        },
        fechaNacimiento: ''
      }
    },
    guardar () {
      this.Estudiante.matricula = this.Estudiante.matricula.text
      var vm = this
      async function enviar () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('create_data', vm.Estudiante)
        if (res.err) {
          vm.sb = true
          vm.msg = res.msj
        } else {
          vm.sb = true
          vm.msg = res.msj
        }
      }
      enviar()
    }
  },
  created () {
    var vm = this
    function enviar () {
      return new Promise(function () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('get', { tipo: 1 })
        if (res.err) {
          vm.sb = true
          vm.msg = res.msj
        } else {
          res.docs.forEach((e) => {
            vm.secciones.push({
              text: e.name
            })
          })
        }
      })
    }
    enviar()
  }
}
</script>

<style lang="css" scoped>

</style>
