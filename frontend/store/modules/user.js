import http from '@/modules/http.js'

const state = {
  authUser: null,
  userLoadingComplete: false,
  apiConfig: require('@/../../config/api.access.config.json')['api_access_filter']['api']
}

const getters = {
  AUTH_USER: state => state.authUser,
  HAVE_AUTH_USER: state => !!state.authUser,
  USER_LOADING_COMPLETE: state => state.userLoadingComplete,
  IS_HIMSELF: state => id => {
    return parseInt(state.authUser.id, 10) === parseInt(id, 10)
  },
  HAS_RIGHTS: state => allowedPermissions => {
    if (state.authUser == null || !state.authUser.permissions) {
      return false
    }

    const userPermissions = state.authUser.permissions
    const userPermissionsLength = userPermissions.length
    for (let i = 0; i < userPermissionsLength; i++) {
      //цикл такой, потому что forEach не прерывается, а этот можно
      if (allowedPermissions.indexOf(userPermissions[i]) !== -1) {
        return true
      }
    }
    return false
  },
  API_CONFIG: state => state.apiConfig,
  HAS_API_ACCESS: (state, getters) => ({ apiName, method }) => {
    if (!getters.API_CONFIG[apiName]) {
      return false
    }
    let apiPermissions = getters.API_CONFIG[apiName].find(apiConfig => {
      if (apiConfig.methods.indexOf(method) !== -1) {
        return true
      }
    })['allow']
    if (typeof apiPermissions === 'string') {
      if (apiPermissions === '*') {
        return true
      } else if (apiPermissions === '@') {
        return getters.HAVE_AUTH_USER
      } else {
        apiPermissions = [apiPermissions.replace('+', '')]
      }
    }
    return getters.HAS_RIGHTS(apiPermissions)
  }
}

const actions = {
  LOAD_AUTH_USER(context) {
    return new Promise((resolve, reject) => {
      if (context.state.authUser) {
        context.commit('SET_USER_LOADING_COMPLETE')
        resolve({ status: 'exist' })
      }
      http
        .get('auth')
        .then(response => response.data)
        .then(data => {
          if (data.success) {
            context.commit('SET_AUTH_USER', data.user)
            context.commit('AUTH_SUCCESS')
            resolve()
          } else {
            reject({
              type: 'no-identity'
            })
          }
        })
        .catch(error => {
          if (error.response.data && !error.response.data.success) {
          } else {
            console.error(error)
          }
          reject({
            type: 'no-identity'
          })
        })
        .finally(() => {
          context.commit('SET_USER_LOADING_COMPLETE')
        })
    })
  }
}

const mutations = {
  SET_AUTH_USER: (state, user) => {
    state.authUser = user
  },
  SET_USER_LOADING_COMPLETE: state => {
    state.userLoadingComplete = true
  },
  CLEAR_AUTH_USER: state => {
    state.authUser = null
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
