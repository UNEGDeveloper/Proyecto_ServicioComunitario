<template lang="html">
  <div class="pa-5">
    <v-layout justify-center>
      <v-flex xs12 md4 >
        <v-card class="elevation-8">
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <h1 class="title text-xs-center">Costancia de Retiro</h1>
              <v-text-field v-model='Estudiante.ci' v-bind:rules="reglas" min="7" max="10" maxlength="10" counter label="Cedula del Estudiante" required />
              <v-text-field v-model='Estudiante.motivo' min="5" max="20" maxlength="20" counter label="Causa de Retiro" required />
              <v-text-field v-model='Estudiante.cod' min="4" max="20" maxlength="20" counter label="Codigo Estadistico" required />
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
              label="Fecha de Retiro"
              v-model="Estudiante.date"
              prepend-icon="event"
              readonly
              ></v-text-field>
              <v-date-picker v-model="Estudiante.date" no-title scrollable actions>
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
          <v-btn v-tooltip:top="{ html: 'Volver' }" @click.native="volver()" icon darke>
            <v-icon large >navigate_before</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="mr-3"  primary light raise :disabled="Estudiante.ci.length < 7 || Estudiante.motivo.length < 5 || Estudiante.cod.length < 4 || Estudiante.date.length === 0 || errores" @click.native="general">Generar Documento</v-btn>
        </v-card-row>
        <div v-if="pl">
           <v-progress-linear v-bind:indeterminate="pl"></v-progress-linear>
        </div>
      </v-card>
    </v-flex>
    </v-layout>
    <v-snackbar
      :timeout="2000"
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
        ci: '',
        motivo: '',
        cod: '',
        date: ''
      },
      sb: false,
      msg: '',
      pl: false,
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
    general () {
      this.sb = true
      this.pl = true
      this.msg = 'Peticion Enviada'
      this.Estudiante.date = this.Estudiante.date.split('-').reverse().join('-')
      var vm = this
      async function preparar () {
        const {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('Constancia_Retiro', vm.Estudiante)
        if (res.err) {
          vm.sb = true
          vm.msg = res.msj
          vm.pl = false
        } else {
          vm.sb = true
          vm.msg = 'Se genero el Documento en su directorio.'
          vm.pl = false
        }
      }
      preparar()
    },
    volver () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="css" scoped>

</style>
