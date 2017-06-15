<template lang="html">
  <div class="pa-5" transition="v-slide-y-transition">
    <v-layout row wrap justify-center >
      <v-flex xs12 md4 class="">
        <v-card class="elevation-8">
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <v-text-field v-model='User.name' label="Usuario" required />
              <v-text-field v-model="User.pass" label="Contraseña" type="Password" required />
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
            <v-spacer></v-spacer>
          <v-btn secondary light @click.native="limpiar">Limpiar</v-btn>
            <v-spacer></v-spacer>
          <v-btn raise primary light :disabled="User.name.length === 0 || User.pass.length === 0" @click.native="guardar">Guardar</v-btn>
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
      User: {
        tipo: 0,
        name: '',
        pass: ''
      },
      sb: false,
      msg: ''
    }
  },
  methods: {
    limpiar () {
      this.User = {
        tipo: 0,
        name: '',
        pass: ''
      }
    },
    guardar () {
      var vm = this
      async function enviar () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('create_data', vm.User)
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
  }
}
</script>

<style lang="css">
</style>
