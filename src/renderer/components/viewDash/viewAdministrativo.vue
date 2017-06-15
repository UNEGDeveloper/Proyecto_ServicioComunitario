<template lang="html">
  <div>
    <v-card class="elevation-8">
    <v-card-title>
      Seleccionar  otros miembros de contacto
      <v-spacer></v-spacer>
      <v-btn icon="icon" class=" mr-1 blue--text" @click.native="guardar()"> <v-icon>save</v-icon></v-btn>
      <v-btn icon="icon" class=" mr-1 red--text" @click.native="resetear()"> <v-icon>delete</v-icon></v-btn>
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
        <td class="text-xs-left">{{ props.item.codigo }}</td>
        <td class="text-xs-left">{{ props.item.info.cedula }}</td>
        <td class="text-xs-right">{{ props.item.info.nombre }}</td>
        <td class="text-xs-right">{{ props.item.info.apellido }}</td>
        <td class="text-xs-right">{{ props.item.cargo }}</td>
        <td class="text-xs-right">{{ props.item.dependencia }}</td>
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
          text: 'Codigo',
          left: true,
          sortable: false,
          value: 'cod'
        },
        {
          text: 'Cedula',
          left: true,
          sortable: false,
          value: 'ci'
        },
         { text: 'Nombre', value: 'name' },
         { text: 'Apellido', value: 'lastname' },
         { text: 'Cargo', value: 'cargo' },
         { text: 'Dependencia', value: 'depend' }
      ],
      items: [],
      seleccionados: [],
      buscado: '',
      sb: false,
      msg: ''
    }
  },
  methods: {
    resetear () {
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          var res = ipcRenderer.sendSync('resetearContacto')
          if (res.err) {
            vm.sb = true
            vm.msg = res.msj
          } else {
            vm.sb = true
            vm.msg = 'La lista de contactos ahora esta vacia, vuelva agregar manualmente'
          }
        })
      }
      enviar()
    },
    guardar () {
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          vm.seleccionados.forEach(function (data) {
            var res = ipcRenderer.sendSync('agregarContacto', { data: data })
            if (res.err) {
              vm.sb = true
              vm.msg = res.msj
            } else {
              data.dependencia = res.dependencia
              vm.sb = true
              vm.msg = 'Se actualizo la lista de contactos'
            }
          })
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
        var res = ipcRenderer.sendSync('get', { tipo: 6 })
        if (res.err) {
          vm.sb = true
          vm.msg = res.msj
        } else {
          res.docs.forEach(function (e) {
            if (e.cargo !== 'Director(a)') {
              vm.items.push({
                _id: e._id,
                codigo: e.codigo,
                info: {
                  _id: e.info._id,
                  cedula: e.info.cedula,
                  nombre: e.info.nombre,
                  apellido: e.info.apellido
                },
                cargo: e.cargo,
                dependencia: e.dependencia
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
