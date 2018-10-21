import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

import User from './models/user'
import Song from './models/song'
import Playlist from './models/playlist'

Vue.use(Vuex)

const production = !window.location.host.includes('localhost')
const baseURL = production ? '//vusic.herokuapp.com' : '//localhost:3002'

const backend = Axios.create({
  baseURL: baseURL,
  timeout: 3000,
  withCredentials: true
})
const itunes = Axios.create({
  baseURL: 'https://itunes.apple.com/search?term=',
  timeout: 3000
})

export default new Vuex.Store({
  state: {
    user: new User(), // empty user
    songs: [],
    activePlaylist: new Playlist(),
    playlists: [],
    songQueue: [],
    isPlaying: false,
    finishedSongs: [],
    snackbar: false
  },
  getters: {
    loggedIn: state => !!state.user._id,
    playlistSelected: state => !!state.activePlaylist._id,
    isPlaying: state => !!state.isPlaying
  },
  mutations: {
    setUser (state, user) {
      state.user = new User(user)
    },
    setSongs (state, songs) {
      state.songs = songs.map(song => new Song({
        ...song,
        imgURL: song.artworkUrl100.replace('100x100bb', '570x570cc')
      }))
    },
    setPlaylists (state, playlists) {
      state.playlists = playlists
    },
    setActivePlaylist (state, playlist) {
      state.activePlaylist = playlist
    },
    removeSongFromPlaylist (state, song) {
      state.activePlaylist.songs = state.activePlaylist.songs.filter(s => s.trackId !== song.trackId)
    },
    setSong (state, song) {
      if (state.songQueue.length && state.songQueue[0].trackId === song.trackId) {
        return
      }
      state.songQueue = [song, ...state.songQueue]
    },
    play (state) {
      state.isPlaying = true
    },
    pause (state) {
      state.isPlaying = false
    },
    nextSong (state) {
      state.finishedSongs.push(state.songQueue.shift())
    },
    previousSong (state) {
      if (!state.finishedSongs.length) {
        return
      }
      state.songQueue.unshift(state.finishedSongs.pop())
    },
    setQueue (state, newQueue) {
      state.songQueue = [...newQueue]
      state.finishedSongs = []
    },
    setSnackbar (state, message) {
      state.snackbar = message
    }
  },
  actions: {
    setSnackbar ({ commit }, error) {
      let message
      if (error instanceof Error) {
        message = error.response && error.response.data ? error.response.data.error : 'An error has occurred.'
      } else {
        message = error
      }
      commit('setSnackbar', message)
    },
    async register ({ commit }, newUser) {
      try {
        const { data } = await backend.post('/register', newUser)
        commit('setUser', data)
        router.push({ name: 'home' })
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    async authenticate ({ commit }) {
      try {
        const { data } = await backend.get('/authenticate')
        commit('setUser', data)
        router.push({ name: 'home' })
      } catch (error) {
        // this.dispatch('setSnackbar', error)
        // swallow your errors
      }
    },
    async login ({ commit }, creds) {
      try {
        const { data } = await backend.post('/login', creds)
        commit('setUser', data)
        router.push({ name: 'home' })
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    async logout ({ commit }) {
      try {
        await backend.delete('/logout')
        commit('setUser')
        router.push({ name: 'login' })
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    async searchItunes ({ commit }, search) {
      try {
        const { data } = await itunes.get(search)
        commit('setSongs', data.results.filter(song => !song.artworkUrl100.includes('Video') && song.trackName))
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    clearSongs ({ commit }) {
      commit('setSongs', [])
    },
    async getPlaylists ({ commit }) {
      try {
        const { data } = await backend.get('/api/playlists')
        const playlists = data.map(playlist => new Playlist(playlist))
        await Promise.all(playlists.map(async playlist => {
          const { data: songsData } = await backend.get('/api/songs/' + playlist._id)
          playlist.songs = songsData.map(song => new Song(song))
        }))
        commit('setPlaylists', playlists)
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    async createPlaylist ({ commit, state }, name) {
      try {
        const { data } = await backend.post('/api/playlists', { name })
        const playlist = new Playlist(data)
        commit('setPlaylists', [...state.playlists, playlist])
        commit('setActivePlaylist', playlist)
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    setActivePlaylist ({ commit }, playlist) {
      commit('setActivePlaylist', playlist)
    },
    async addToPlaylist ({ dispatch, state }, song) {
      try {
        const { data: songData } = await backend.post('/api/songs/', {
          name: song.name,
          artist: song.artist,
          album: song.album,
          imgURL: song.imgURL,
          songURL: song.songURL,
          trackId: song.trackId
        })
        song._id = songData._id
        await backend.post('/api/playlists/add-song', {
          songId: song._id,
          playlistId: state.activePlaylist._id
        })
        dispatch('updatePlaylists')
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    async removePlaylist ({ commit, state }, playlist) {
      try {
        await backend.delete('/api/playlists/' + playlist._id)
        const playlists = state.playlists.filter(currentPlaylist => currentPlaylist._id !== playlist._id)
        commit('setPlaylists', playlists)
        if (playlist._id === state.activePlaylist._id) {
          commit('setActivePlaylist', new Playlist())
        }
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    async removeFromPlaylist ({ commit, state }, song) {
      try {
        backend.delete('/api/playlists/delete-song/' + state.activePlaylist._id + '/' + song._id)
        commit('removeSongFromPlaylist', song)
      } catch (error) {
        this.dispatch('setSnackbar', error)
      }
    },
    async updatePlaylists ({ dispatch, state }) {
      await dispatch('getPlaylists')
      dispatch('setActivePlaylist', state.playlists.find(p => p._id === state.activePlaylist._id) || new Playlist())
    },
    play ({ commit, state }, song) {
      if (!state.songQueue.length && !song) {
        return commit('pause')
      }
      commit('pause')
      if (song) {
        commit('setSong', song)
      }
      setTimeout(() => commit('play'), 10)
    },
    pause ({ commit }) {
      commit('pause')
    },
    async nextSong ({ commit, dispatch }) {
      await commit('nextSong')
      dispatch('play')
    },
    async previousSong ({ commit, dispatch }) {
      await commit('previousSong')
      dispatch('play')
    },
    async playPlaylist ({ commit, dispatch, state }) {
      await commit('setQueue', state.activePlaylist.songs)
      dispatch('play')
    },
    async shufflePlaylist ({ commit, dispatch, state }) {
      await commit('setQueue', [...state.activePlaylist.songs].sort(() => Math.random() * 10 < Math.random() * 10))
      dispatch('play')
    }
  }
})
