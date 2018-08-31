import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'

Vue.use(Vuex)

const backend = Axios.create({
  baseURL: 'localhost:3000',
  timeout: 3000,
  withCredentials: true
})
const itunes = Axios.create({
  baseURL: 'https://itunes.apple.com/search?term=',
  timeout: 3000
})

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {}
})
