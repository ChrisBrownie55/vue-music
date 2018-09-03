<template>
  <div class='playlist'>
    <header>
      <h3 class='font-weight-medium text-truncate'>{{ $props.data.name }}</h3>
      <v-menu>
        <v-btn slot='activator' icon>
          <v-icon>more_horiz</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click='$emit("removePlaylist", $props.data)'>Remove</v-list-tile>
          <v-list-tile @click='$emit("renamePlaylist", $props.data)'>Rename</v-list-tile>
        </v-list>
      </v-menu>
    </header>
    <section class='buttons'>
      <v-btn outline depressed class='primary--text' round small>Play</v-btn>
      <v-btn flat class='accent--text' round small>Shuffle</v-btn>
    </section>
    <transition mode='out-in'>
      <p v-if='!$props.data.songs.length'>No songs</p>
      <section v-else class='songs'>
        <article class='song' v-for='song in $props.data.songs' :key='song._id'>
          <v-img :src='song.imgURL' aspect-ratio='1'>
            <transition mode='out-in'>
              <div class='actions' v-if='$store.state.activeSong.trackId !== song.trackId' key='play-addToPlaylist'>
                <v-icon @click='playSong(song)' class='play'>play_arrow</v-icon>
              </div>
              <div class='actions' v-else key='pause'>
                <v-icon @click='pauseSong'>pause</v-icon>
              </div>
            </transition>
          </v-img>
          <p class='text-truncate'>
            <span>{{ song.name }}</span>
            •
            <span>{{ song.artist }}</span>
          </p>
          <v-menu>
            <v-btn slot='activator' icon>
              <v-icon>more_horiz</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click='removeSong(song)'>Remove</v-list-tile>
              <v-list-tile @click='playSong(song)'>Play</v-list-tile>
              <v-list-tile @click='() => {}'>Copy link</v-list-tile>
            </v-list>
          </v-menu>
        </article>
      </section>
    </transition>
  </div>
</template>

<script>
import Playlist from '@/models/playlist.js';

export default {
  name: 'playlist',
  props: {
    data: {
      validator: value => value instanceof Playlist,
      required: true
    }
  },
  methods: {
    playSong(song) {
      this.$store.dispatch('play', song);
    },
    removeSong(song) {
      this.$store.dispatch('removeFromPlaylist', song);
    },
    pauseSong() {
      this.$store.dispatch('pause');
    }
  }
};
</script>

<style scoped lang='scss'>
</style>