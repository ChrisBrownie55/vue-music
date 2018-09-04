<template>
  <section class='audio-player'>
    <article class='buttons'>
      <v-btn icon @click='store.$dispatch("previousSong")'>
        <v-icon>skip_previous</v-icon>
      </v-btn>
      <transition mode='out-in'>
        <v-btn icon v-if='!playing' @click='$store.dispatch("play")'>
          <v-icon>play_arrow</v-icon>
        </v-btn>
        <v-btn icon v-else @click='$store.dispatch("pause")'>
          <v-icon>pause</v-icon>
        </v-btn>
      </transition>
      <v-btn icon @click='$store.dispatch("nextSong")'>
        <v-icon>skip_next</v-icon>
      </v-btn>
    </article>
    <audio :src='src' ref='audio' @ended='$store.dispatch("nextSong")'></audio>
    <article class='slider'>

    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'audio-player',
  computed: {
    src() {
      return this.$store.state.songQueue.length
        ? this.$store.state.songQueue[0].songURL
        : '';
    },
    ...mapGetters({
      playing: 'isPlaying'
    })
  },
  watch: {
    playing(playing) {
      if (playing) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
      return playing;
    },
    src(newSrc, oldSrc) {
      if (newSrc !== oldSrc && newSrc) {
        this.$refs.audio.currentTime = 0;
      }
      return newSrc;
    }
  }
};
</script>

<style scoped>
</style>