<template lang="html">
  <div class="pa-5" transition="v-slide-y-transition">
    <v-layout row wrap justify-center>
      <v-flex xs12 md4 class="">
        <v-card class="elevation-8">
        <v-card-row>
          <v-card-text>
            <v-container fluid class="pa-3">
              <v-btn-dropdown
                label="Año Escolar y Sección"
                v-bind:options="anio"
                v-model="Matricula.anio"
              ></v-btn-dropdown>
              <v-text-field v-model="Matricula.seccion" max="1" maxlength="1" counter label="Sección" required />
              <v-text-field v-model="Matricula.turno" max="1" maxlength="1" counter label="Turno" required />
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
            <v-spacer></v-spacer>
          <v-btn secondary light @click.native="limpiar">Limpiar</v-btn>
            <v-spacer></v-spacer>
          <v-btn primary light :disabled="Matricula.anio.text === '' || Matricula.seccion.length === 0 ||  Matricula.turno.length === 0" primary @click.native="guardar">Guardar</v-btn>
            <v-spacer></v-spacer>
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
      Matricula: {
        tipo: 1,
        anio: '',
        seccion: 'A',
        turno: 'M',
        name: this.fullMatricula
      },
      sb: false,
      msg: '',
      anio: [
        { text: '1' },
        { text: '2' },
        { text: '3' },
        { text: '4' },
        { text: '5' },
        { text: '6' }
      ]
    }
  },
  methods: {
    limpiar () {
      this.Matricula = {
        tipo: 1,
        anio: '',
        seccion: 'A',
        turno: 'M',
        name: this.fullMatricula
      }
    },
    guardar () {
      this.Matricula.name = this.fullMatricula
      this.Matricula.anio = parseInt(this.Matricula.anio.text)
      var vm = this
      async function enviar () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('create_data', vm.Matricula)
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
  computed: {
    fullMatricula () {
      var str = this.Matricula.anio.text + '°' + this.Matricula.seccion
      return str
    }
  }
}
</script>

<style lang="css">
</style>
