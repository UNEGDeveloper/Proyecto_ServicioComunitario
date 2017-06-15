<template lang="html">
  <div>
    <v-card class="elevation-8">
    <v-card-title>
      Estudiante
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
        v-bind:items="items"
        v-model="seleccionados"
        v-bind:search="buscado"

        select-all
        selected-key="_id"
        rows-per-page-text="Número de Filas"
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
            @open="props.item.info._cedula = props.item.info.cedula"
            @cancel="props.item.info.cedula = props.item.info._cedula || props.item.info.cedula"
            lazy
          >
            <div class="text-md-right">
            {{ props.item.info.cedula }}
           </div>
            <v-text-field
              slot="input"
              label="Cedula"
              min="9"
              max="12"
              maxlength="12"
              required
              v-bind:value="props.item.info.cedula"
              v-on:change="val => props.item.info.cedula = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item.info._nombre = props.item.info.nombre"
            @cancel="props.item.info.nombre = props.item.info._nombre || props.item.info.nombre"
            lazy
            > <div class="text-md-right">
              {{ props.item.info.nombre }}
             </div>
            <v-text-field
              slot="input"
              label="Nombre"
              min="10"
              max="20"
              maxlength="20"
              required
              v-bind:value="props.item.info.nombre"
              v-on:change="val => props.item.info.nombre = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item.info._apellido = props.item.info.apellido"
            @cancel="props.item.info.apellido = props.item.info._apellido || props.item.info.apellido"
            lazy
          > <div class="text-md-right">
              {{ props.item.info.apellido }}
            </div>
            <v-text-field
              slot="input"
              label="Apellido"
              min="10"
              max="20"
              maxlength="20"
              required
              v-bind:value="props.item.info.apellido"
              v-on:change="val => props.item.info.apellido = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item.info._edad = props.item.info.edad"
            @cancel="props.item.info.edad = props.item.info._edad || props.item.info.edad"
            lazy
          > <div class="text-md-right">
            {{ props.item.info.edad }}
          </div>
            <v-text-field
              slot="input"
              label="Edad"
              min="2"
              max="2"
              maxlength="2"
              required
              v-bind:value="props.item.info.edad"
              v-on:change="val => props.item.info.edad = parseInt(val)"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item.info._direccion = props.item.info.direccion"
            @cancel="props.item.info.direccion = props.item.info._direccion || props.item.info.direccion"
            lazy
          > <div class="text-md-right">
            {{ props.item.info.direccion }}
          </div>
            <v-text-field
              slot="input"
              label="Dirección"
              min="8"
              max="30"
              maxlength="30"
              required
              v-bind:value="props.item.info.direccion"
              v-on:change="val => props.item.info.direccion = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item.matricula._name = props.item.matricula.name"
            @cancel="props.item.matricula.name = props.item.matricula._name || props.item.matricula.name"
            lazy
          > <div class="text-md-right">
            {{ props.item.matricula.name }}
          </div>
          <v-text-field
            slot="input"
            label="Matricula"
            min="3"
            max="3"
            maxlength="3"
            required
            v-bind:value="props.item.matricula.name"
            v-on:change="val => props.item.matricula.name = val"
            single-line counter="counter"
          ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            class="text-xs-right"
            @open="props.item.representante._cedula  = props.item.representante.cedula"
            @cancel="props.item.representante.cedula  = props.item.representante._cedula || props.item.representante.cedula"
            large
            lazy
          >
          <div class="text-xs-right">{{ props.item.representante.nombre + ' ' + props.item.representante.apellido }}</div>
          <div slot="input" class="mt-3 title">Representante</div>
            <v-text-field
              slot="input"
              label="Cedula"
              v-bind:value="props.item.representante.cedula"
              v-on:change="val => props.item.representante.cedula = val"
              single-line
              min="9"
              max="10"
              maxlength="10"
              counter
              autofocus
            ></v-text-field>
            <v-text-field
              slot="input"
              label="Nombre Representante"
              v-bind:value="props.item.representante.nombre"
              v-on:change="val => props.item.representante.nombre = val"
              single-line
              counter
            ></v-text-field>
            <v-text-field
              slot="input"
              label="Apellido del Representante"
              v-bind:value="props.item.representante.apellido"
              v-on:change ="val => props.item.representante.apellido = val"
              single-line
              counter
            ></v-text-field>
          </v-edit-dialog>
        </td>
      </template>
    </v-data-table>
    <v-snackbar
      :timeout="3000"
      :bottom="true"
      :right="true"
      v-model="sb"
    >
      {{msg}}
    </v-snackbar>
  </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        {
          text: 'Cedula',
          left: true,
          sortable: false,
          value: 'cedula'
        },
         { text: 'Nombre', value: 'nombre' },
         { text: 'Apellido', value: 'apellido' },
         { text: 'Edad', value: 'edad' },
         { text: 'Dirección', value: 'direccion' },
         { text: 'Cursa', value: 'matricula' },
         { text: 'Representante', value: 'representante' }
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
            var res = ipcRenderer.sendSync('put', { tipo: 1, data: data })
            if (res.err) {
              vm.sb = true
              vm.msg = res.msj
            } else {
              cant = cant + 1
            }
          })
          vm.sb = true
          vm.msg = 'Se actualizo ' + cant + ' estudiantes'
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
            var res = ipcRenderer.sendSync('remove', { tipo: 1, data: data })
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
          vm.msg = 'Se elimino ' + cant + ' estudiantes'
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
        var res = ipcRenderer.sendSync('get', { tipo: 3 })
        if (res.err) {
          vm.sb = true
          vm.msg = res.msj
        } else {
          res.docs.forEach(function (e) {
            var sinMatricula = { _id: '', name: '' }
            if (e.matricula) {
              sinMatricula._id = e.matricula._id
              sinMatricula.name = e.matricula.name
            }
            vm.items.push({
              _id: e._id,
              info: {
                _id: e.info._id,
                cedula: e.info.cedula,
                nombre: e.info.nombre,
                apellido: e.info.apellido,
                direccion: e.info.direccion,
                edad: e.info.edad
              },
              matricula: {
                _id: sinMatricula._id,
                name: sinMatricula.name
              },
              representante: {
                cedula: e.representante.cedula,
                nombre: e.representante.nombre,
                apellido: e.representante.apellido
              }
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
