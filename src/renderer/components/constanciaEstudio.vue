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
                      <v-progress-circular indeterminate v-bind:size="70" v-bind:width="4" class="green--text"></v-progress-circular>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </v-flex >
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  created () {
    var vm = this
    function enviar () {
      return new Promise(function () {
        setTimeout(function () {
          var {ipcRenderer} = require('electron')
          var res = ipcRenderer.sendSync('constancia_estudio')
          if (res.err) {
            vm.inicio = false
            vm.sb = true
            vm.msg = res.msj
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
