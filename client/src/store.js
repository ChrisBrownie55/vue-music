import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

import User from './models/user'
import Song from './models/song'
import Playlist from './models/playlist'

Vue.use(Vuex)

const backend = Axios.create({
  baseURL: '//localhost:3002',
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
    activeSong: new Song()
  },
  getters: {
    loggedIn: state => !!state.user._id,
    playlistSelected: state => !!state.activePlaylist._id,
    songPlaying: state => !!state.activeSong.trackId
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
    }
  },
  actions: {
    async register ({ commit }, newUser) {
      try {
        const { data } = await backend.post('/register', newUser)
        commit('setUser', data)
        router.push({ name: 'home' })
      } catch (error) {
        console.warn(error)
      }
    },
    async authenticate ({ commit }) {
      try {
        const { data } = await backend.get('/authenticate')
        commit('setUser', data)
        router.push({ name: 'home' })
      } catch (error) {
        console.warn(error)
      }
    },
    async login ({ commit }, creds) {
      try {
        const { data } = await backend.post('/login', creds)
        commit('setUser', data)
        router.push({ name: 'home' })
      } catch (error) {
        console.warn(error)
      }
    },
    async logout ({ commit }) {
      try {
        await backend.delete('/logout')
        commit('setUser')
        router.push({ name: 'login' })
      } catch (error) {
        console.warn(error)
      }
    },
    async searchItunes ({ commit }, search) {
      try {
        const { data } = await itunes.get(search)
        commit('setSongs', data.results.filter(song => !song.artworkUrl100.includes('Video') && song.trackName))
      } catch (error) {
        console.warn(error)
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
        console.warn(error)
      }
    },
    async createPlaylist ({ commit, state }, name) {
      try {
        const { data } = await backend.post('/api/playlists', { name })
        const playlist = new Playlist(data)
        commit('setPlaylists', [...state.playlists, playlist])
        commit('setActivePlaylist', playlist)
      } catch (error) {
        console.warn(error)
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
        console.warn(error)
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
        console.warn(error)
      }
    },
    async removeFromPlaylist ({ commit, state }, song) {
      try {
        backend.delete('/api/playlists/delete-song/' + state.activePlaylist._id + '/' + song._id)
        commit('removeSongFromPlaylist', song)
      } catch (error) {
        console.warn(error)
      }
    },
    async updatePlaylists ({ dispatch, state }) {
      await dispatch('getPlaylists')
      dispatch('setActivePlaylist', state.playlists.find(p => p._id === state.activePlaylist._id) || new Playlist())
    }
  }
})
