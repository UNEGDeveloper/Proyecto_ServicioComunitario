<template lang="html">
  <div class="text-md-center pt-5">
      <v-layout row wrap class="pt-5" justify-center>
        <v-flex xs5 align="center" md3>
            <v-card class="formulario-login elevation-8 pa-1 grey lighten-5" >
            <v-card-row>
              <v-card-text>
                <v-container fluid>
                  <v-text-field v-on:keyup.enter.native="acceder" v-model="User.name" label="Usuario" required />
                  <v-text-field v-on:keyup.enter.native="acceder" v-model="User.pass" label="Contraseña" type="password" required />
                </v-container>
              </v-card-text>
            </v-card-row>
            <v-card-row actions>
              <v-btn @click.native="volver()" icon darke>
                <v-icon large >navigate_before</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn  primary light @click.native="acceder">Ingresar</v-btn>
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
  name: 'acceso',
  data () {
    return {
      User: {
        name: '',
        pass: ''
      },
      sb: false,
      msg: ''
    }
  },
  methods: {
    volver () {
      this.$router.go(-1)
    },
    limpiar () {
      this.User = {
        name: '',
        pass: ''
      }
    },
    acceder () {
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          var res = ipcRenderer.sendSync('getUser', vm.User)
          if (res.err) {
            vm.sb = true
            vm.msg = res.msj
          } else {
            vm.$router.push({ path: '/dash/' + vm.User.name, params: { id: vm.User.name } })
          }
        })
      }
      enviar()
    }
  }
}
</script>

<style lang="css" scoped>

</style>
