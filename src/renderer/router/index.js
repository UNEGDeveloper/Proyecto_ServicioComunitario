import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: require('@/components/Inicio')
    },
    {
      path: '/Bienvenida',
      component: require('@/components/Bienvenida')
    },
    {
      path: '/login/',
      component: require('@/components/Acceso')
    },
    {
      path: '/dash/:id',
      component: require('@/components/DashBoard'),
      props: true
    },
    {
      path: '/Constancia_Retiro/',
      component: require('@/components/ConstanciaRetiro')
    },
    {
      path: '/Constancia_Sexto/',
      component: require('@/components/ConstanciaSextoG')
    },
    {
      path: '/Justificacion_Laboral/',
      component: require('@/components/JustificacionLaboral')
    },
    {
      path: '/Emergencia/',
      component: require('@/components/Emergencia')
    },
    {
      path: '/Estudio/',
      component: require('@/components/constanciaEstudio')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
