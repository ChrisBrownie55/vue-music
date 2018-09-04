<template>
  <section class='itunes'>
    <transition name='fade-up' mode='out-in'>
      <div class='empty-search' v-if='!search' key='empty'>
        <h4>Search iTunes</h4>
        <p class='caption'>Find your favorite songs, artists, or albums.</p>
      </div>
      <div class='empty-search' v-else-if='!songs.length'>
        <h4>No results.</h4>
      </div>
      <div class='songs' v-else key='songs'>
        <song card v-for='(song, index) in songs' :isPlaying='$store.getters.isPlaying && $store.state.songQueue[0].trackId === song.trackId' :key='index' :data='song' v-on:play='playSong' v-on:addToPlaylist='addToPlaylist' v-on:pause='pauseSong' />
      </div>
    </transition>
  </section>
</template>

<script>
import Song from '@/components/Song.vue';

export default {
  name: 'itunes',
  props: ['search'],
  watch: {
    search(newSearch) {
      if (!newSearch) {
        this.$store.dispatch('clearSongs');
      } else {
        this.$store.dispatch('searchItunes', newSearch);
      }
      return newSearch;
    }
  },
  computed: {
    songs() {
      return this.$store.state.songs;
    }
  },
  methods: {
    playSong(song) {
      this.$store.dispatch('play', song);
    },
    addToPlaylist(song) {
      this.$store.dispatch('addToPlaylist', song);
    },
    pauseSong() {
      this.$store.dispatch('pause');
    }
  },
  components: {
    Song
  }
};
</script>

<style scoped lang='scss'>
.empty-search {
  padding: 3rem;
  h4 {
    font-size: 1.9rem;
    line-height: 2rem;
    font-weight: 600;
    text-transform: none;
    margin-bottom: 0.5rem;
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.25s, transform 0.25s;
  will-change: opacity, transform;
}
.fade-up-enter,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-3rem);
}

.songs {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>