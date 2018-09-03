<template>
  <v-card class='song-card'>
    <v-img :src='data.imgURL' aspect-ratio='1'>
      <transition mode='out-in'>
        <div class='actions' v-if='!$props.isPlaying' key='play-addToPlaylist'>
          <v-icon @click='$emit("play", data)' class='play'>play_arrow</v-icon>
          <v-icon @click='$emit("addToPlaylist", data)'>add</v-icon>
        </div>
        <div class='actions' v-else key='pause'>
          <v-icon @click='$emit("pause", data)'>pause</v-icon>
        </div>
      </transition>
    </v-img>
    <v-card-title primary-title class='card-text'>
      <h3 class='text-truncate body-2'>{{ data.name }}</h3>
      <h3 class='text-truncate body-1'>{{ data.artist }}</h3>
    </v-card-title>
  </v-card>
</template>

<script>
import Song from '@/models/song.js';

export default {
  name: 'song',
  props: {
    data: {
      validator: value => value instanceof Song,
      required: true
    },
    isPlaying: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang='scss'>
.song-card {
  margin: 0.5rem;
  width: 12rem;
  border-radius: 0 !important;
  padding: 0 !important;

  .v-image {
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
        font-size: 2.5rem;
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

  &:hover > .v-image {
    .v-image__image {
      filter: brightness(35%);
    }
    .actions {
      opacity: 1;
    }
  }

  .card-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    & * {
      width: 100%;
      text-align: left;
    }
  }
}
</style>