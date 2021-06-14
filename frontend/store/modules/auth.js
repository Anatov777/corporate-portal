import http from '@/modules/http.js'

const state = {
  isLogin: false
}

const getters = {
  IS_LOGIN: state => !!state.isLogin
}

const actions = {
  AUTH_REQUEST(context, user) {
    return new Promise((resolve, reject) => {
      http
        .post('auth', {
          login: user.username,
          password: user.password
        })
        .then(response => {
          if (response.data.success) {
            context.commit('AUTH_SUCCESS')
            context.commit('SET_AUTH_USER', response.data.user)
            resolve()
          } else {
            reject(response)
          }
        })
        .catch(error => {
          context.commit('AUTH_LOGOUT')
          reject(error)
        })
    })
  },
  AUTH_LOGOUT({ commit }) {
    return new Promise(resolve => {
      http
        .delete('auth')
        .then(() => {
          commit('AUTH_LOGOUT')
          commit('CLEAR_AUTH_USER')
          resolve()
        })
        .catch(error => {
          if (error.response.data && !error.response.data.success) {
            commit('AUTH_LOGOUT')
            commit('CLEAR_AUTH_USER')
            resolve()
          } else {
            console.error(error)
          }
        })
    })
  }
}

const mutations = {
  AUTH_SUCCESS(state) {
    state.isLogin = true
  },
  AUTH_LOGOUT(state) {
    state.isLogin = false
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
