import store from '@/store'
import router from '@/router'

const onServerReject = function(error) {
  return new Promise(function(resolve) {
    if (error.response.status === 401 && error.response.config && !error.response.config.__isRetryRequest) {
      const currentRoute = router.history.current
      const redirectUrl = currentRoute.path
      // if unauthorized, logout the user
      store.commit('AUTH_LOGOUT')
      if (!currentRoute.meta.noAuth && currentRoute.name) {
        router.push({
          name: 'login',
          query: {
            redirect: redirectUrl === '/' ? null : redirectUrl
          }
        })
      }
      resolve(error.response)
    } else if (error.response.status === 403) {
      console.error('FORBIDDEN!', error.response)
    } else if (error.response.status === 404) {
      let config = error.response.config
      //если в заголовке запроса указана необходимость редиректа на 404 то редиректим
      if (config.headers && config.headers.redirect404) {
        router.replace({ name: 'errors' })
      } else {
        console.error('404!', error.response)
      }
    }
    throw error
  })
}

export default onServerReject
