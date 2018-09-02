import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

import User from './models/user'
import Song from './models/song'
import Playlist from './models/playlist'

Vue.use(Vuex)

const backend = Axios.create({
  baseURL: 'https://localhost:3002',
  timeout: 3000,
  withCredentials: true
})
const itunes = Axios.create({
  baseURL: 'https://itunes.apple.com/search?term=',
  timeout: 3000
})

export default new Vuex.Store({
  state: {
    user: new User() // empty user
  },
  getters: {
    loggedIn: state => state.user._id && state.user.username
  },
  mutations: {
    setUser (state, user) {
      state.user = new User(user)
    }
  },
  actions: {
    async register ({ commit }, newUser) {
      try {
        const res = await backend.post('/register', newUser)
        commit('setUser', res.data)
        router.push({ name: 'home' })
      } catch (error) {
        console.warn(error)
      }
    },
    async authenticate ({ commit }) {
      try {
        const res = await backend.get('/authenticate')
        commit('setUser', res.data)
        router.push({ name: 'home' })
      } catch (error) {
        console.warn(error)
      }
    },
    async login ({ commit }, creds) {
      try {
        const res = await backend.post('/login', creds)
        commit('setUser', res.data)
        router.push({ name: 'home' })
      } catch (error) {
        console.warn(error)
      }
    },
    async logout ({ commit }, creds) {
      try {
        await backend.delete('/logout')
        commit('setUser')
        router.push({ name: 'login' })
      } catch (error) {
        console.warn(error)
      }
    }
  }
})
