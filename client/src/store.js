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
    register ({ commit }, newUser) {
      backend.post('/register', newUser).then(res => {
        commit('setUser', res.data)
        router.push({ name: 'home' })
      })
    },
    authenticate ({ commit }) {
      backend.get('/authenticate').then(res => {
        commit('setUser', res.data)
        router.push({ name: 'home' })
      })
    },
    login ({ commit }, creds) {
      backend.post('/login', creds).then(res => {
        commit('setUser', res.data)
        router.push({ name: 'home' })
      })
    }
  }
})
