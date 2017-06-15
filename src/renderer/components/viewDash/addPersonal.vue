<template lang="html">
  <div class="pa-5">
    <v-layout row wrap justify-center>
      <v-flex xs12 md6 class="">
        <v-card class="elevation-3">
        <v-card-row>
          <v-card-text>
            <v-container fluid>
              <v-text-field v-model='Personal.cod' label="Codigo del Personal"  min="3" max="10" maxlength="10" counter required />
              <v-text-field v-model="Personal.cargo" label="Cargo" hint="Ej: Secretaria, etc." required  />
              <v-text-field v-model="Personal.prof" label="Profesion" hint="Ej: Licda, Licdo, Ing, etc. Deje en Blanco si no tiene."/>
              <v-text-field v-model='Personal.ci' v-bind:rules="reglas" min="7" max="10" maxlength="10" label="Cedula" counter required />
              <v-text-field v-model="Personal.name" label="Nombre"  />
              <v-text-field v-model="Personal.lastname" label="Apellido"  />
              <v-text-field v-model="Personal.edad" v-bind:rules="reglas" min="2" max="2" maxlength="2" label="Edad"  />
              <v-text-field v-model="Personal.depend" label="Dependencia" hint="Ingrese aqui mas detalles sobre a que pertence. Generalmente el personal pertenece a la misma Institucion"  />
              <v-text-field v-model="Personal.dir" label="Dirección"  />
              <v-text-field v-model="Personal.telf" label="Telefono"  />
              <v-menu
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="v-scale-transition"
        offset-y
        :nudge-left="56"
      >
        <v-text-field
          slot="activator"
          label="Fecha Ingreso"
          v-model="Personal.fechaIngreso"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="Personal.fechaIngreso" no-title scrollable actions>
          <template scope="{ save, cancel }">
            <v-card-row actions>
              <v-btn flat primary @click.native="cancel()">Cancelar</v-btn>
              <v-btn flat primary @click.native="save()">Guardar</v-btn>
            </v-card-row>
          </template>
        </v-date-picker>
      </v-menu>
            </v-container>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="mr-3" secondary light raise @click.native="limpiar">Limpiar</v-btn>

          <v-btn class="mr-3" primary light :disabled="Personal.ci.length < 7 || Personal.cod.length < 3 || errores || Personal.fechaIngreso.length === 0"  primary darken raise @click.native="guardar">Guardar</v-btn>

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
      Personal: {
        cod: '',
        tipo: 4,
        ci: '',
        name: '',
        lastname: '',
        edad: '',
        dir: '',
        telf: '0416-0000000',
        depend: '',
        fechaIngreso: '',
        cargo: 'Secretaria',
        prof: 'Licda'
      },
      sb: false,
      menu: false,
      msg: '',
      reglas: [
        (s) => {
          if (!isNaN(s)) {
            this.errores = false
            return true
          } else {
            this.errores = true
            return 'No ingrese simbolos o letras solo numeros'
          }
        }
      ],
      errores: false
    }
  },
  methods: {
    limpiar () {
      this.Personal = {
        cod: '',
        tipo: 4,
        ci: '',
        name: '',
        lastname: '',
        edad: '',
        dir: '',
        telf: '0416-0000000',
        depend: '',
        fechaIngreso: '',
        cargo: 'Secretaria',
        prof: 'Licda'
      }
    },
    guardar () {
      var vm = this
      async function enviar () {
        var {ipcRenderer} = require('electron')
        var res = ipcRenderer.sendSync('create_data', vm.Personal)
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
