import { logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from '@/store'

Vue.use(VueAxios, axios)
const state = {
  token: getToken(),
  user_id: '',
  name: '',
  user: '',
  avatar: '',
  introduction: '',
  cafeteria: '',
  cafeteria_id: '',
  ask_change_pass: '',
  roles: '',
  school: '',
  api_token: '',
  permissions: []
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER: (state, name) => {
    state.user = name
  },
  SET_ASK_CHANGE_PASS: (state, ask_change_pass) => {
    state.ask_change_pass = ask_change_pass
  },
  SET_USER_ID: (state, id) => {
    state.user_id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SCHOOL: (state, school) => {
    state.school = school
  },
  SET_Permissions: (state, permissions) => {
    state.permissions = permissions
  },
  SET_Api_token: (state, api_token) => {
    state.api_token = api_token
  },
  SET_CAFETERIA: (state, cafeteria) => {
    state.cafeteria = cafeteria
  },
  SET_CAFETERIA_ID: (state, cafeteria_id) => {
    state.cafeteria_id = cafeteria_id
  }
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      axios.post(store.getters.api_route + 'user/login', userInfo)
        .then(res => {
          if (typeof res.data.token !== 'undefined') {
            commit('SET_TOKEN', res.data.token)
            setToken(res.data.token)
            resolve()
          }
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
    })
  },
  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      const header = {
        'Content-Type': 'multipart/form-data'
      }
      if (store.getters.token !== '') {
        header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
      }
      const config = {
        headers: header// {"content-type": 'multipart/form-data'}
      }
      const formdata = new FormData()
      axios.post(store.getters.api_route + 'user/detail', formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { ask_change_pass, id, permissions, api_token, school, roles, name, avatar, introduction, cafeteria, user, cafeteria_id } = data
          if (roles.length === 0) {
            reject('The user haven\'t any roles .')
          }
          const roles1 = []
          roles.forEach(function(entry) {
            roles1.push(entry.name)
          })
          commit('SET_ROLES', roles1.toString())
          commit('SET_USER_ID', id)
          commit('SET_SCHOOL', school)
          commit('SET_ASK_CHANGE_PASS', ask_change_pass)
          commit('SET_Permissions', permissions)
          commit('SET_Api_token', api_token)
          commit('SET_NAME', name)
          commit('SET_CAFETERIA', cafeteria)
          commit('SET_CAFETERIA_ID', cafeteria_id)
          commit('SET_USER', user)
          commit('SET_AVATAR', store.getters.app_route + avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch(err => {
          console.log(err)
          dispatch('tagsView/delAllViews', null, { root: true })
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()
          reject(err)
        })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)
    const { roles } = await dispatch('getInfo')
    resetRouter()
    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)
    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
