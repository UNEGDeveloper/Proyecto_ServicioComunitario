<template lang="html">
  <div class="pa-5" transition="v-slide-y-transition">
    <v-layout row wrap justify-center>
      <v-flex xs12 md6 class="">
        <v-card class="elevation-3">
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <v-text-field v-model='Docente.cod'  label="Codigo del Docente" min="3" max="10" maxlength="10" counter required />
              <v-text-field v-model="Docente.cargo" label="Tipo de Docente" hint="Ingrese aqui mas detalles del cargo que cumple Ej: Docente Especialista. Si solo es un Docente de Aula deje en blanco"  />
              <v-text-field v-model='Docente.ci' v-bind:rules="reglas" min="7" max="10" maxlength="10" label="Cedula" counter required />
              <v-text-field v-model="Docente.name" label="Nombre"  />
              <v-text-field v-model="Docente.lastname" label="Apellido"  />
              <v-text-field v-model="Docente.edad" v-bind:rules="reglas" min="2" max="2" maxlength="2" counter label="Edad" />
              <v-text-field v-model="Docente.dir" label="Dirección"  />
              <v-text-field v-model="Docente.telf" label="Telefono"  />
              <v-btn-dropdown
                label="Año Escolar y Sección"
                v-bind:options="secciones"
                v-model="Docente.matricula"
              ></v-btn-dropdown>
              <v-menu
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="v-scale-transition"
        offset-y
        :nudge-left="56"
      >
        <v-text-field
          slot="activator"
          label="Fecha Ingreso"
          v-model="Docente.fechaIngreso"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="Docente.fechaIngreso" no-title scrollable actions>
          <template scope="{ save, cancel }">
            <v-card-row actions>
              <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
              <v-btn flat primary @click.native="save()">Save</v-btn>
            </v-card-row>
          </template>
        </v-date-picker>
      </v-menu>
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="mr-3" secondary light raise @click.native="limpiar">Limpiar</v-btn>

          <v-btn class="mr-3" primary light :disabled="Docente.ci.length < 7 || Docente.cod.length < 3 || errores || Docente.fechaIngreso.length === 0"  primary darken raise @click.native="guardar">Guardar</v-btn>

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
      Docente: {
        cod: '',
        tipo: 3,
        ci: '',
        name: '',
        lastname: '',
        edad: '',
        dir: '',
        telf: '0416-0000000',
        matricula: '',
        fechaIngreso: '',
        cargo: 'Docente de Aula'
      },
      sb: false,
      menu: false,
      msg: '',
      secciones: [],
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
      this.Docente = {
        cod: '',
        tipo: 3,
        ci: '',
        name: '',
        lastname: '',
        edad: '',
        dir: '',
        telf: '0416-0000000',
        matricula: '',
        fechaIngreso: '',
        cargo: 'Docente de Aula'
      }
    },
    guardar () {
      if (this.Docente.matricula) {
        this.Docente.matricula = this.Docente.matricula.text
      }
      var vm = this
      async function enviar () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('create_data', vm.Docente)
        if (res.err) {
          vm.sb = true
          vm.msg = res.msj
        } else {
          vm.sb = true
          vm.msg = res.msj
          vm.secciones.filter(function (i) {
            return i !== vm.Docente.matricula.text
          })
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
        var res = ipcRenderer.sendSync('get', { tipo: 2 })
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

<style lang="css">
</style>
