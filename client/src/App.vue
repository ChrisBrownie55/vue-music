<template>
  <v-app id="app">
    <router-view />
    <v-snackbar v-model='snackbar' :timeout='5000' bottom>
      {{ snackbar }}
      <v-btn color='white' flat @click='snackbar = false'>
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  computed: {
    snackbar: {
      get: function() {
        return this.$store.state.snackbar;
      },
      set: function(value) {
        if (value === true) {
          return;
        }
        this.$store.dispatch('setSnackbar', value);
      }
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700');

html {
  overflow: auto;
}

body {
  margin: 0;
}

#app {
  --theme-color: #673ab7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  min-height: 100vh;
}
</style>
