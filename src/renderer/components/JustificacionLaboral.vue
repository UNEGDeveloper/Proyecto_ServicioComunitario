<template lang="html">
  <div class="pa-5">
    <v-layout justify-center>
      <v-flex xs12 md4 >
        <v-card class="elevation-8">
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <h1 class="title text-xs-center">Justificativo Laboral</h1>
              <v-text-field v-model='Personal.cod' min="4" max="15" maxlength="15" counter label="Codigo " hint="Codigo del Docente o Personal" required />
            <v-text-field v-model='Personal.sueldo' v-bind:rules="reglas" counter label="Remuneración" required />
            <v-text-field v-model='Personal.turno' counter label="Turno de Trabajo" hint="Mañana, Tarde, Mañaña y Tarde." required />
            <v-radio label="Docente" v-model="tipo" value=2 dark></v-radio>
            <v-radio label="Personal" v-model="tipo" value=1 dark></v-radio>
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn v-tooltip:top="{ html: 'Volver' }" @click.native="volver()" icon darke>
            <v-icon large >navigate_before</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="mr-3"  primary light raise :disabled="Personal.cod.length < 4 || errores || tipo === 0" @click.native="general">Generar Documento</v-btn>
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
      Personal: {
        cod: '',
        sueldo: 5000,
        turno: 'Mañana'
      },
      sb: false,
      msg: '',
      pl: false,
      menu: false,
      tipo: 0,
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
      this.msg = 'Petición Enviada'
      var vm = this
      async function preparar () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('Constancia_trabajo', {tipo: parseInt(vm.tipo), data: vm.Personal})
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
