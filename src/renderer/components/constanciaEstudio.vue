<template lang="html">
  <div class="pa-5">
    <v-layout justify-center>
      <v-flex xs12 md4 >
        <v-card class="elevation-8">
          <div v-if="pl">
           <v-progress-linear height="5" v-bind:indeterminate="pl"></v-progress-linear>
        </div>
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <h1 class="title text-xs-center pb-3">Costancia de Estudio</h1>
              <v-text-field  v-model='Estudiante.ci' v-bind:rules="reglas" min="7" max="15" maxlength="15" counter label="Cedula del Estudiante" required />
              <v-text-field  v-model='Estudiante.anio' v-bind:rules="reglas" max="4" maxlength="4" counter label="Año Escolar" required />
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn v-tooltip:top="{ html: 'Volver' }" @click.native="volver()" icon darke>
            <v-icon large >navigate_before</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="mr-3"  primary light raise :disabled="Estudiante.ci.length < 7 || errores" @click.native="general">Generar Documento</v-btn>
        </v-card-row>
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
        anio: '' + new Date().getFullYear()
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
    async general () {
      this.pl = true
      var vm = this
      setTimeout(() => {
        return new Promise(() => {
          var {ipcRenderer} = require('electron')
          var res = ipcRenderer.sendSync('constancia_estudio', vm.Estudiante)
          vm.sb = true
          vm.msg = res.msj
          setTimeout(() => {
            vm.pl = false
          }, 2000)
        })
      }, 2000)
    },
    volver () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="css" scoped>

</style>
