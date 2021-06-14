import store from '@/store'

const beforeRoute = function(to, from, next) {
  //Если роут ведет на страницу forbidden пропускаем без проверок
  if (to.name === 'forbidden') {
    next()
    return
  }

  //если у нас есть залогиненный пользователь или нет, но уже проверяли, то пропускаем в зависимости от прав
  if (store.getters.HAVE_AUTH_USER || store.getters.USER_LOADING_COMPLETE) {
    nextByRights(to, next)
  } else {
    //если пользователя нет, то попробуем его получить и запомнить
    store
      .dispatch('LOAD_AUTH_USER')
      .then(() => {
        nextByRights(to, next)
      })
      .catch(error => {
        //если просто не залогинен, то пропустим в зависимости от прав
        if (error.type === 'no-identity') {
          nextByRights(to, next)
          return
        }
        //TODO: тут надо посмотреть какие ошибки могут возвращаться и что с этим делать
        console.error(error)
      })
  }
}

const goToLogin = function(fullPath, next) {
  let params = {
    path: '/login'
  }
  if (fullPath && fullPath !== '/') {
    params.query = { redirect: fullPath }
  }
  next(params)
}

const nextByRights = function(to, next) {
  //если переход с логина и указан путь редиректа то по нему и перенаправляем
  if (to.name === 'login' && to.query.redirect) {
    next({
      path: to.query.redirect
    })
    return
  }
  //если не требуется авторизация, то спокойно пропускаем дальше
  const isNotRequiredAuth = to.matched.some(record => record.meta.noAuth)
  if (isNotRequiredAuth) {
    next()
    // TODO: Проверить позже так ли
    return
  }

  //если вдруг нет залогиненного пользователя то редирект на страницу login
  if (!store.getters.HAVE_AUTH_USER) {
    goToLogin(to.fullPath, next)
    return
  }

  //если в роуте указано разрешение на просмотр страницы для себя, проверка работает для роутов с id сотрудника в параметрах
  const allowHimself = to.matched.some(record => record.meta.allowHimself)
  if (allowHimself && store.getters.IS_HIMSELF(to.params.id)) {
    next()
  } else if (to.matched.some(record => record.meta.permissions)) {
    //если в роуте указаны права, то будем пропускать по ним
    const permissions = getRights(to.matched)
    if (store.getters.HAS_RIGHTS(permissions)) {
      next()
    } else {
      next({
        path: '/forbidden'
      })
    }
  } else {
    //если ничего в роуте не указано, значит можно
    next()
  }
}

const getRights = matched => {
  return matched.reduce((concat, record) => [].concat(concat, record.meta.permissions), [])
}

export default beforeRoute
