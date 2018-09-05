<template>
  <section class='audio-player'>
    <article class='buttons'>
      <v-btn icon @click='$store.dispatch("previousSong")'>
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
    <audio :src='src' ref='audio' @ended='$store.dispatch("nextSong")' @timeupdate='position = $event.target.currentTime'></audio> 
    <article class='slider'>
      <input type='range' v-model='position' class='range-slider' @change='seek' min='0' step='0.5' :max='$refs.audio ? $refs.audio.duration : 0' />
    </article>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'audio-player',
  data() {
    return {
      position: 0
    };
  },
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
  },
  methods: {
    seek(event) {
      console.log(event.target.getAttribute('max'))
      if (this.$refs.audio) {
        this.$refs.audio.currentTime = event.target.value
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.audio-player {
  box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 8px 1px 8px 0 rgba(0,0,0,.12);
}

.slider {
  height: 0.5rem;
  overflow: visible;
  transform: translateY(-1.25rem);
}

.range-slider {
  -webkit-appearance: none;
  width: 20rem;
  background: transparent;
  transition: opacity 0.2s ease-in-out;
  margin: 0;
  &:disabled {
    opacity: 0.5;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    transition: background 0.2s;
    width: 100%;
    height: 2px;
    cursor: pointer;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    background: #bbccdd;
    border: solid transparent 1px;
    border-radius: 2rem;
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    border: 0px;
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 1.5rem;
    background: #673AB7;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -0.25rem;
  }
  &:active {
    &::-webkit-slider-thumb {
      background: #eee;
      width: 0.75rem;
      height: 0.75rem;
      margin-top: -0.35rem;
      margin-left: -0.035rem / 2;
    }
    &::-webkit-slider-runnable-track {
      background: #bbccdd;
    }
  }
}
</style>