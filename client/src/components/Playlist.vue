<template>
  <div class='playlist'>
    <header>
      <h3 class='font-weight-medium text-truncate'>{{ $props.data.name }}</h3>
      <v-btn icon @click='$store.dispatch("playPlaylist")'>
        <v-icon>play_arrow</v-icon>
      </v-btn>
      <v-btn icon @click='$store.dispatch("shufflePlaylist")'>
        <v-icon>shuffle</v-icon>
      </v-btn>
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
    <transition mode='out-in'>
      <p v-if='!$props.data.songs.length'>No songs</p>
      <section v-else class='songs elevation-2'>
        <div style='display: contents;' v-for='(song, index) in $props.data.songs' :key='song._id'>
          <v-divider v-if='index' />
          <article class='song' :class='{ hover: $store.state.songQueue.length && $store.state.songQueue[0].trackId === song.trackId }'>
            <v-img :src='song.imgURL'>
              <transition mode='out-in'>
                <div class='actions' v-if='$store.getters.isPlaying && $store.state.songQueue[0].trackId === song.trackId' key='pause'>
                  <v-icon @click='pauseSong'>pause</v-icon>
                </div>
                <div class='actions' v-else key='play-addToPlaylist'>
                  <v-icon @click='playSong(song)' class='play'>play_arrow</v-icon>
                </div>
              </transition>
            </v-img>
            <p class='text-truncate song-name'>
              <span>{{ song.name }}</span>
              •
              <span>{{ song.artist }}</span>
            </p>
            <v-menu class='more'>
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
        </div>
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
header {
  display: flex;
  align-items: center;
  padding-left: 0.3rem;
  margin-bottom: 1.5rem;

  h3 {
    margin-right: auto;
  }
  .v-btn {
    margin: 0;
  }
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  button {
    margin: 0;
  }
}

.songs {
  display: flex;
  flex-direction: column;
  width: calc(100% + 2rem);
  transform: translateX(-1rem);

  .song {
    display: flex;
    height: 4rem;
    align-items: center;
    // transition: box-shadow 0.2s;
    // will-change: box-shadow;

    // &:hover {
    //   box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    //     0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12) !important;
    // }

    .song-name {
      margin: 0;
      margin-left: 0.75rem;
    }

    .more {
      margin-left: auto;
    }
  }
}
</style>
<style lang='scss'>
.songs .song {
  .v-image {
    width: 4rem !important;
    height: 4rem !important;
    min-width: 4rem;
    flex: unset;

    .v-image__image {
      transition: filter 0.2s;
      will-change: filter;
    }
    .actions {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      height: 100%;
      opacity: 0;
      transition: opacity 0.2s;
      .v-icon {
        color: white;
        font-size: 1.8rem;
        border-radius: 50%;
        padding: 0.25rem;
        transition: transform 0.1s;
        &.play {
          border: solid 1px white;
        }
        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
  &:hover .v-image,
  &.hover .v-image {
    .v-image__image {
      filter: brightness(35%);
    }
    .actions {
      opacity: 1;
    }
  }
}
</style>