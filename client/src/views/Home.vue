<template>
  <main>
    <header class='px-4 pt-1 mb-3'>
      <v-btn small round :flat='!playlists' class='playlists-button' :class='{ primary: playlists, white: !playlists }' @click='playlists = !playlists'>Playlists</v-btn>
      <v-btn small round flat class='error' @click.prevent='$store.dispatch("logout")'>Logout</v-btn>
    </header>
    <section class='playlist-sidebar'>
      <section class='active-playlist'></section>
      <section class='playlists'></section>
    </section>
    <section class='search'>
      <search-bar v-model='search'></search-bar>
      <iTunes :search='search'></iTunes>
      <section class='audio-bar'></section>
    </section>
  </main>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import iTunes from '@/components/iTunes.vue';

export default {
  name: 'home',
  data() {
    return {
      playlists: false,
      search: ''
    };
  },
  components: {
    SearchBar,
    iTunes
  }
};
</script>

<style scoped lang='scss'>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.5rem;
  background-color: #eee;
  // border-bottom: solid 1px rgba(#683ab7, 0.25);

  button {
    transform: translateY(50%);
    &.playlists-button {
      border: solid 1px rgba(#683ab7, 0.1) !important;
    }
  }
}
</style>