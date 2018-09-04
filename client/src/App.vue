<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

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
