import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
// , tagsView, fixedHeader, sidebarLogo
const { showSettings } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: true,
  fixedHeader: true,
  sidebarLogo: true
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

