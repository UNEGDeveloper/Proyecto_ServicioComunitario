<template lang="html">
  <div>
      <v-card class="elevation-8">
    <v-card-title>
      Usuario
      <v-spacer></v-spacer>
      <v-btn icon="icon" class="mr-1 red--text" @click.native="eliminar()"> <v-icon>delete</v-icon></v-btn>
      <v-btn icon="icon" class="mr-1 blue--text" @click.native="guardar()"> <v-icon>save</v-icon></v-btn>
      <v-text-field
        append-icon="search"
        label="Buscar"
        single-line
        hide-details
        v-model="buscado"
      ></v-text-field>
    </v-card-title>
    <v-data-table
        v-bind:headers="headers"
        v-model="seleccionados"
        v-bind:items="items"
        v-bind:search="buscado"
        selected-key="_id"
        select-all
      >
      <template slot="items" scope="props">
        <td>
          <v-checkbox
            hide-details
            primary
            v-model="props.selected"
          ></v-checkbox>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item.value = true, props.item._name = props.item.name"
            @cancel="props.item.value = false, props.item.name = props.item._name || props.item.name"
            lazy
          > {{ props.item.name }}
            <v-text-field
              slot="input"
              label="Id"
              v-bind:value="props.item.name"
              v-on:change="val => props.item.name = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">{{ new Date(props.item.creado).toLocaleString() }}</td>
      </template>
    </v-data-table>
  </v-card>
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
      headers: [
        {
          text: 'Nombre de Usuario',
          left: true,
          sortable: false,
          value: 'name'
        },
         { text: 'Creado', value: 'c' }
      ],
      items: [],
      seleccionados: [],
      buscado: '',
      sb: false,
      msg: ''
    }
  },
  methods: {
    guardar () {
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          var cant = 0
          vm.seleccionados.forEach(function (data) {
            var res = ipcRenderer.sendSync('put', { tipo: 0, data: data })
            if (res.err) {
              vm.sb = true
              vm.msg = res.msj
            } else {
              cant = cant + 1
            }
          })
          vm.sb = true
          vm.msg = 'Se actualizo ' + cant + ' usuarios'
        })
      }
      enviar()
    },
    eliminar () {
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          var cant = 0
          vm.seleccionados.forEach(function (data) {
            var res = ipcRenderer.sendSync('remove', { tipo: 0, data: data })
            if (res.err) {
              vm.sb = true
              vm.msg = res.msj
            } else {
              cant = cant + 1
              vm.items = vm.items.filter(function (e) {
                if (e === data) {
                  return false
                }
                return true
              })
            }
          })
          vm.sb = true
          vm.msg = 'Se elimino ' + cant + ' usuarios'
        })
      }
      enviar()
    }
  },
  mounted () {
    var vm = this
    function enviar () {
      return new Promise(function () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('get', { tipo: 0 })
        if (res.err) {
          vm.sb = true
          vm.msg = res.msj
        } else {
          res.docs.forEach(function (e) {
            if (e.name !== 'root') {
              vm.items.push({
                _id: e._id,
                name: e.name,
                pass: e.pass,
                creado: e.creado
              })
            }
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
