<template lang="html">
  <div class="pa-5">
    <v-layout justify-center>
      <v-flex xs12 md4 >
        <v-card class="elevation-8">
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <h1 class="title text-xs-center">Costancia de Sexto Grado</h1>
              <v-text-field v-model='Estudiante.ci' v-bind:rules="reglas" min="7" max="15" maxlength="15" counter label="Cedula del Estudiante" required />
              <v-text-field v-model='Estudiante.nota' min="1" max="1" maxlength="10" counter label="Nota Literal" required />
              <v-text-field v-model='Estudiante.periodo' min="9" max="10" maxlength="10" counter label="Periodo Escolar" required />
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn v-tooltip:top="{ html: 'Volver' }" @click.native="volver()" icon darke>
            <v-icon large >navigate_before</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="mr-3"  primary light raise :disabled="Estudiante.ci.length < 7 || Estudiante.periodo.length < 9 || errores" @click.native="general">Generar Documento</v-btn>
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
        nota: 'A',
        periodo: '' + new Date().getFullYear() - 1 + '-' + new Date().getFullYear()
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
      var vm = this
      async function preparar () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('constancia_sexto_grado', vm.Estudiante)
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
