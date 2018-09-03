<template>
  <main>
    <header class='px-5'>
      <v-btn small round :flat='!playlists' class='playlists-button px-3' :class='{ primary: playlists, white: !playlists }' @click='playlists = !playlists'>Playlists</v-btn>
      <svg @click='scrollToTop()' class='logo' xmlns="http://www.w3.org/2000/svg" height="168px" width="168px" version="1.1" viewBox="0 0 168 168">
        <circle cx='84' cy='84' r='49%' fill='white'></circle>
        <path fill="#683ab7" d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z" />
      </svg>
      <v-btn small round flat class='error' @click.prevent='$store.dispatch("logout")'>Logout</v-btn>
    </header>
    <div class='content-container'>
      <section class='playlist-sidebar' :class='{ open: playlists }'>
        <section class='active-playlist'></section>
        <section class='playlists'></section>
      </section>
      <section class='search'>
        <search-bar v-model='search' />
        <iTunes :search='search' />
        <section class='audio-bar'></section>
      </section>
    </div>
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
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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
  align-items: flex-end;
  padding: 0;
  background-color: hsl(262, 52%, 60%); //#eee;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  height: 2.5rem;

  button,
  .logo {
    margin: 0;
    transform: translateY(50%);
    &.playlists-button {
      border: solid 1px rgba(#683ab7, 0.1) !important;
    }
  }
  .logo {
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    filter: drop-shadow(0 3px 1px rgba(0, 0, 0, 0.2))
      drop-shadow(0 2px 2px rgba(0, 0, 0, 0.14))
      drop-shadow(0 1px 5px rgba(0, 0, 0, 0.12));
  }
}

.search {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  transition: margin-left 0.2s;
  will-change: margin-left;
}

main {
  height: calc(100% - 2.5rem);
  padding-top: 2.5rem;
}

.content-container {
  display: flex;
  height: 100%;
}

.playlist-sidebar {
  width: 0;
  height: calc(100vh - 2.5rem);
  transition: width 0.2s;
  will-change: width;
  position: fixed;
  top: 2.5rem;
  left: 0;
  z-index: 1;
  border-right: solid 1px #673ab733;

  &.open {
    width: 20rem;

    & + .search{
      margin-left: 20rem;
    }
  }
}
</style>