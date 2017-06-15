<template lang="html">
  <div id="dashboard">
    <v-app id="dashboard">
      <v-navigation-drawer persistent darker :mini-variant.sync="mini" v-model="nav4">
        <v-list class="pa-0">
        <v-list-item>
          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>

            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Primero de Mayo II</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn light icon  @click.native.stop="mini = !mini">
                <v-icon light>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-item>
      </v-list>
        <v-list class="pt-0" dense>
          <template v-for="(item,i) in itemGroup">
            <v-list-group v-if="item.items">
              <v-list-item slot="item">
                <v-list-tile ripple>
                  <v-list-tile-action>
                    <v-icon light>{{item.avatar}}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="item.title" />
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon light >keyboard_arrow_down</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list-item>
              <v-list-item v-for="(subItem,i) in item.items" :key="i">
                <v-list-tile ripple @click.native="cambiar(item.title + ' \\ ' + subItem.title, subItem.ruta)">
                  <v-list-tile-title v-text="subItem.title" />
                </v-list-tile>
              </v-list-item>
            </v-list-group>
            <v-subheader class="white--text" v-else-if="item.header" v-text="item.header" />
            <v-divider v-else-if="item.divider" light />
            <v-list-item v-else>
              <v-list-tile ripple @click.native="cambiar('', item.ruta)">
                <v-list-tile-action>
                  <v-icon light>{{item.avatar}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.title" />
                </v-list-tile-content>
              </v-list-tile>
            </v-list-item>
          </template>
        </v-list>
    </v-navigation-drawer>
      <v-toolbar fixed>
        <v-toolbar-side-icon light @click.native.stop="nav4 = !nav4" class="hidden-lg-and-up"/>
        <v-toolbar-title class="white--text">{{tituloMenu}}</v-toolbar-title>
          <v-menu bottom left transition="v-scale-transition">
           <v-btn light icon slot="activator">
             <v-icon>more_vert</v-icon>
           </v-btn>
           <v-list>
             <v-list-item>
               <v-list-tile>
                 <v-list-tile-title>Editar {{user}}</v-list-tile-title>
               </v-list-tile>
               <v-list-tile @click.native="salir">
                 <v-list-tile-title>Salir</v-list-tile-title>
               </v-list-tile>
             </v-list-item>
           </v-list>
         </v-menu>
      </v-toolbar>
    <main>
        <v-container class="grey lighten-3" fluid>
          <transition name="slide-fade" mode="out-in">
            <contenido :is='view' ></contenido>
          </transition>
        </v-container>
    </main>
    <v-footer class="primary">
      <span>© 2017</span>
    </v-footer>
  </v-app>
  </div>
</template>

<script>
import Informacion from './viewDash/Informacion'
import addEstudiante from './viewDash/addEstudiante'
import addDocente from './viewDash/addDocente'
import addUser from './viewDash/addUser'
import addMatricula from './viewDash/addMatricula'
import addDirector from './viewDash/addDirector'
import addPersonal from './viewDash/addPersonal'
import viewEstudiante from './viewDash/viewEstudiante'
import viewDocente from './viewDash/viewDocente'
import viewPersonal from './viewDash/viewPersonal'
import viewUsuario from './viewDash/viewUsuario'
import viewAdministrativo from './viewDash/viewAdministrativo'
import viewMatricula from './viewDash/viewMatricula'
export default {
  components: {
    Informacion,
    addEstudiante,
    addDocente,
    addDirector,
    addUser,
    addMatricula,
    addPersonal,
    viewEstudiante,
    viewDocente,
    viewUsuario,
    viewMatricula,
    viewPersonal,
    viewAdministrativo
  },
  $el: 'dashboard',
  data () {
    return {
      user: this.$route.params.id,
      nav4: false,
      mini: false,
      itemGroup: [
        { header: 'Control Estudiantil' },
        {
          avatar: 'person',
          title: 'Estudiantes',
          group: '/Estudiantes',
          items: [
            { title: 'Agregar', ruta: 'addEstudiante' },
            { title: 'Modificar', ruta: 'viewEstudiante' }
          ]
        },
        {
          avatar: 'note',
          title: 'Matriculas',
          group: '/Matriculas',
          items: [
            { title: 'Agregar', ruta: 'addMatricula' },
            { title: 'Modificar', ruta: 'viewMatricula' }
          ]
        },
        { divider: true },
        { header: 'Control de Personal' },
        {
          avatar: 'people',
          title: 'Personal',
          group: '/Personal',
          items: [
            { title: 'Agregar', ruta: 'addPersonal' },
            { title: 'Modificar', ruta: 'viewPersonal' }
          ]
        },
        {
          avatar: 'school',
          title: 'Docentes',
          group: '/Docentes',
          items: [
            { title: 'Agregar', ruta: 'addDocente' },
            { title: 'Modificar', ruta: 'viewDocente' }
          ]
        },
        { divider: true },
        { header: 'Departamento Administrativo' },
        {
          avatar: 'gavel',
          title: 'Institución',
          group: '/Docentes',
          items: [
            { title: 'Director', ruta: 'addDirector' },
            { title: 'Información de Contacto', ruta: 'viewAdministrativo' }
          ]
        },
        { divider: true },
        { header: 'Control del Sistema' },
        {
          avatar: 'supervisor_account',
          title: 'Usuarios',
          group: '/Usuarios',
          items: [
            { title: 'Agregar', ruta: 'addUser' },
            { title: 'Modificar', ruta: 'viewUsuario' }
          ]
        },
        { divider: true },
        { title: 'Salir', ruta: '/', avatar: 'exit_to_app' }
      ],
      tituloMenu: 'Informacion',
      view: 'Informacion'
    }
  },
  methods: {
    salir () {
      this.$router.push('/Bienvenida')
    },
    cambiar (titulo, ruta) {
      if (ruta === '/') {
        this.$router.push('/Bienvenida')
      } else {
        this.tituloMenu = titulo
        this.view = ruta
      }
    }
  }
}
</script>

<style lang="css" scoped>
.contenedor {
  background-color: inherit;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
