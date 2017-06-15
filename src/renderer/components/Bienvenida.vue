  <template lang="html">
  <div class="text-md-center pt-5 ">
      <v-layout row wrap justify-center >
        <v-flex xs12 md6 >
          <v-card class="yellow darken-1 white--text text-xs-center elevation-10 mt-2">
            <v-card-row height="100px">
              <v-card-title>
                      <v-spacer></v-spacer>
                Te damos la Bienvenida
                      <v-spacer></v-spacer>
              </v-card-title>
            </v-card-row>
          </v-card>
          <v-card class="blue darken-4 white--text text-xs-center elevation-10 mt-3">
            <v-card-row height="100px">
              <v-card-title>
                <v-spacer></v-spacer>
                Sistema Administración Estudiantil <br>
                <v-spacer></v-spacer>
              </v-card-title>
            </v-card-row>
          </v-card>
          <v-card class="red darken-2 white--text text-xs-center elevation-10 mt-2">
            <v-card-row height="100px">
              <v-card-title>
                      <v-spacer></v-spacer>
                Seleccione una opción
                      <v-spacer></v-spacer>
              </v-card-title>
            </v-card-row>
            <v-card-row actions>
              <v-btn v-tooltip:left="{ html: 'Costancia de Retiro' }" flat @click.native="seleccion(0)" class="white--text">Retiro</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-tooltip:top="{ html: 'Costancia de Sexto Grado' }" @click.native="seleccion(1)" flat class="white--text">6°grado</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-tooltip:bottom="{ html: 'Justificación Laboral' }" @click.native="seleccion(2)" flat class="white--text">Laboral</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-tooltip:top="{ html: 'Numeros de Emergencia' }" @click.native="seleccion(3)" flat class="white--text">Emergencia</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-tooltip:top="{ html: 'Constancia de Estudio' }" @click.native="seleccion(4)" flat class="white--text">Estudio</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-tooltip:right="{ html: 'Administración del Sistema' }" @click.native="seleccion(5)" icon light>
                <v-icon>settings_system_daydream</v-icon>
              </v-btn>
            </v-card-row>
          </v-card>
        </v-flex>
      </v-layout>
  </div>
</template>

<script>
export default {
  methods: {
    seleccion (op) {
      switch (op) {
        case 0:
          this.$router.push('Constancia_Retiro')
          break
        case 1:
          this.$router.push('Constancia_Sexto')
          break
        case 2:
          this.$router.push('Justificacion_Laboral')
          break
        case 3:
          this.$router.push('Emergencia')
          break
        case 4:
          this.$router.push('Estudio')
          break
        case 5:
          this.$router.push('login')
          break
        default:
      }
    }
  }
}
</script>

<style lang="css">
</style>
