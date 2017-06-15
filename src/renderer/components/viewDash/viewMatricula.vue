<template lang="html">
  <div>
      <v-card class="elevation-8">
    <v-card-title>
      Matriculas
      <v-spacer></v-spacer>
      <v-btn icon="icon" class="mr-1 red--text" @click.native="eliminar()"> <v-icon>delete</v-icon></v-btn>

      <v-btn icon="icon" class="mr-1 red--text" @click.native="limpiar()"> <v-icon>clear</v-icon></v-btn>

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
        select-all
        selected-key="_id"
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
            @open="props.item._name = props.item.name"
            @cancel="props.item.name = props.item._name || props.item.name"
            lazy
          >
            <div class="text-md-left">
            {{ props.item.name }}
           </div>
            <v-text-field
              slot="input"
              label="A°S"
              v-bind:value="props.item.name"
              min="3"
              max="3"
              maxlength="3"
              required
              v-on:change="val => props.item.name = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item._turno = props.item.turno"
            @cancel="props.item.turno = props.item._turno || props.item.turno"
            lazy
          >
            <div class="text-md-right">
            {{ props.item.turno }}
           </div>
            <v-text-field
              slot="input"
              label="A°S"
              v-bind:value="props.item.turno"
              min="1"
              max="1"
              maxlength="1"
              required
              v-on:change="val => props.item.turno = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">{{ props.item.docente.nombre + ' ' + props.item.docente.apellido }}</td>
        <td class="text-xs-right">{{ props.item.hembras }}</td>
        <td class="text-xs-right">{{ props.item.machos }}</td>
        <td class="text-xs-right">{{ props.item.nAlumnos }}</td>
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
          text: 'Año y Sección',
          left: true,
          sortable: false,
          value: 'name'
        },
        { text: 'Turno', value: 't' },
        { text: 'Docente', value: 'docente' },
        { text: 'H', value: 'h' },
        { text: 'M', value: 'm' },
        { text: 'Total de Alumnos', value: 'num' }
      ],
      items: [],
      seleccionados: [],
      buscado: '',
      sb: false,
      msg: ''
    }
  },
  methods: {
    eliminar () {
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          var cant = 0
          vm.seleccionados.forEach(function (data) {
            var res = ipcRenderer.sendSync('remove', { tipo: 2, data: data })
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
          vm.msg = 'Se elimino ' + cant + ' matriculas'
        })
      }
      enviar()
    },
    guardar () {
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          var cant = 0
          vm.seleccionados.forEach(function (data) {
            if (data.nAlumnos !== 0) {
              var res = ipcRenderer.sendSync('put', { tipo: 2, data: data })
              if (res.err) {
                vm.sb = true
                vm.msg = res.msj
              } else {
                cant = cant + 1
              }
            }
          })
          vm.sb = true
          vm.msg = 'Se Actualizo ' + cant + ' matriculas'
        })
      }
      enviar()
    },
    limpiar () {
      var vm = this
      function enviar () {
        return new Promise(function () {
          var {ipcRenderer} = require('electron')
          var cant = 0
          vm.seleccionados.forEach(function (data) {
            if (data.nAlumnos !== 0) {
              var res = ipcRenderer.sendSync('remove', { tipo: 3, data: data })
              if (res.err) {
                vm.sb = true
                vm.msg = res.msj
              } else {
                cant = cant + 1
                data.nAlumnos = 0
                data.machos = 0
                data.hembras = 0
                data.estudiantes = []
              }
            }
          })
          vm.sb = true
          vm.msg = 'Se vacio ' + cant + ' matriculas'
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
        var res = ipcRenderer.sendSync('get', { tipo: 5 })
        if (res.err) {
          vm.sb = true
          vm.msg = res.msj
        } else {
          res.docs.forEach(function (e) {
            var h = 0
            var m = 0
            e.estudiantes.forEach(function (gen) {
              if (gen.genero === 'M') {
                m = m + 1
              } else {
                h = h + 1
              }
            })
            var sinDocente = {
              _id: '',
              nombre: '',
              apellido: ''
            }
            if (e.docente) {
              sinDocente = {
                _id: e.docente._id,
                nombre: e.docente.info.nombre,
                apellido: e.docente.info.apellido
              }
            }
            vm.items.push({
              _id: e._id,
              name: e.name,
              docente: sinDocente,
              turno: e.turno,
              machos: m,
              hembras: h,
              nAlumnos: e.estudiantes.length,
              estudiantes: e.estudiantes
            })
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
