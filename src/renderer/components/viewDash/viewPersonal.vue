<template lang="html">
  <div>
    <v-card class="elevation-8">
    <v-card-title>
      Personal
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
            @open="props.item.info._cedula = props.item.info.codigo"
            @cancel="props.item.info.codigo = props.item.info._codigo || props.item.info.codigo"
            lazy
          >
            <div class="text-md-right">
            {{ props.item.codigo }}
           </div>
            <v-text-field
              slot="input"
              label="Codigo"
              min="9"
              max="12"
              maxlength="12"
              required
              v-bind:value="props.item.info.codigo"
              v-on:change="val => props.item.info.codigo = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item.info._cedula = props.item.info.cedula"
            @cancel="props.item.info.cedula = props.item.info._cedula || props.item.info.cedula"
            lazy
          >
            <div class="text-xs-right">
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
            @open="props.item._profesion = props.item.profesion"
            @cancel="props.item.profesion = props.item._profesion || props.item.profesion"
            lazy
          >
            <div class="text-md-right">
            {{ props.item.profesion }}
           </div>
            <v-text-field
              slot="input"
              label="Profesion"
              min="3"
              max="5"
              maxlength="5"
              required
              v-bind:value="props.item.profesion"
              v-on:change="val => props.item.profesion = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item.info._nombre = props.item.info.nombre"
            @cancel="props.item.info.nombre = props.item.info._nombre || props.item.info.nombre"
            lazy
          >
            <div class="text-md-right">
            {{ props.item.info.nombre }}
           </div>
            <v-text-field
              slot="input"
              label="Nombre"
              min="4"
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
          >
            <div class="text-md-right">
            {{ props.item.info.apellido }}
           </div>
            <v-text-field
              slot="input"
              label="Apellido"
              min="4"
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
          >
            <div class="text-md-right">
            {{ props.item.info.edad }}
           </div>
            <v-text-field
              slot="input"
              label="Edad"
              min="4"
              max="20"
              maxlength="20"
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
          >
            <div class="text-md-right">
            {{ props.item.info.direccion }}
           </div>
            <v-text-field
              slot="input"
              label="Direccion"
              min="4"
              max="20"
              maxlength="20"
              required
              v-bind:value="props.item.info.direccion"
              v-on:change="val => props.item.info.direccion = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item._telefono = props.item.telefono"
            @cancel="props.item.telefono = props.item._telefono || props.item.telefono"
            lazy
          >
            <div class="text-md-right">
            {{ props.item.telefono }}
           </div>
            <v-text-field
              slot="input"
              label="Direccion"
              min="4"
              max="20"
              maxlength="20"
              required
              v-bind:value="props.item.telefono"
              v-on:change="val => props.item.telefono = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item._cargo = props.item.cargo"
            @cancel="props.item.cargo = props.item._cargo || props.item.cargo"
            lazy
          >
            <div class="text-md-right">
            {{ props.item.cargo }}
           </div>
            <v-text-field
              slot="input"
              label="Direccion"
              min="4"
              max="25"
              maxlength="25"
              required
              v-bind:value="props.item.cargo"
              v-on:change="val => props.item.cargo = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            @open="props.item._dependencia = props.item.dependencia"
            @cancel="props.item.dependencia = props.item._dependencia || props.item.dependencia"
            lazy
          >
            <div class="text-md-right">
            {{ props.item.dependencia }}
           </div>
            <v-text-field
              slot="input"
              label="Direccion"
              min="4"
              max="40"
              maxlength="40"
              required
              v-bind:value="props.item.dependencia"
              v-on:change="val => props.item.dependencia = val"
              single-line counter="counter"
            ></v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">{{ new Date(props.item.fechaIngreso).toLocaleDateString() }}</td>
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
         { text: 'Profesion', value: 'prof' },
         { text: 'Nombre', value: 'name' },
         { text: 'Apellido', value: 'lastname' },
         { text: 'Edad', value: 'edad' },
         { text: 'Dirección', value: 'dir' },
         { text: 'Telefono', value: 'telf' },
         { text: 'Cargo', value: 'cargo' },
         { text: 'Dependencia', value: 'depend' },
         { text: 'Fecha Ingreso', value: 'fecha' }
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
            var res = ipcRenderer.sendSync('put', { tipo: 3, data: data })
            if (res.err) {
              vm.sb = true
              vm.msg = res.msj
            } else {
              cant = cant + 1
            }
          })
          vm.sb = true
          vm.msg = 'Se actualizo ' + cant + ' personas de la nomina del personal'
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
            var res = ipcRenderer.sendSync('remove', { tipo: 4, data: data })
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
          vm.msg = 'Se elimino ' + cant + ' personas de la nomina del personal'
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
            vm.items.push({
              _id: e._id,
              codigo: e.codigo,
              info: {
                _id: e.info._id,
                cedula: e.info.cedula,
                nombre: e.info.nombre,
                apellido: e.info.apellido,
                direccion: e.info.direccion,
                edad: e.info.edad
              },
              profesion: e.profesion,
              cargo: e.cargo,
              telefono: e.telefono,
              dependencia: e.dependencia,
              fechaIngreso: e.fechaIngreso
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
