<template lang="html">
  <div class="">
    <v-container>
      <v-layout row wrap justify-center class="text-xs-center">
        <v-flex xs10 md8 >
          <div class="pt-5">
              <div class="pt-5">
                <div class="pt-5">
                  <div class="pt-5 ">
                    <div class="pt-5 ">
                      <v-progress-circular indeterminate v-bind:size="70" v-bind:width="4" class="red--text"></v-progress-circular>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </v-flex >
      </v-layout>
    </v-container>
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
      sb: false,
      msg: ''
    }
  },
  created () {
    var vm = this
    function enviar () {
      return new Promise(function () {
        setTimeout(function () {
          var {ipcRenderer} = require('electron')
          var res = ipcRenderer.sendSync('Constancia_Emergencia', 'emergencia')
          if (res.err) {
            vm.inicio = false
            vm.sb = true
            vm.msg = res.msj
            setTimeout(function () {
              vm.$router.go(-1)
            }, 2000)
          } else {
            vm.sb = true
            vm.msg = res.msj
            setTimeout(function () {
              vm.$router.go(-1)
            }, 2000)
          }
        }, 1000)
      })
    }
    enviar()
  }
}
</script>

<style lang="css">
</style>
