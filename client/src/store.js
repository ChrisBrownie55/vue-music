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
    playlists: []
  },
  getters: {
    loggedIn: state => state.user._id && state.user.username
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
        commit('setSongs', data.results)
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
        commit ('setPlaylists', data)
      } catch (error) {
        console.warn(error)
      }
    },
    async createPlaylist ({ dispatch, commit }, name) {
      try {
        const { data } = await backend.post('/api/playlists', { name })
      } catch (error) {
        console.warn(error)
      }
    }
  }
})
