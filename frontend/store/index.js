import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/modules/auth.js'
import user from '@/store/modules/user.js'
import department from '@/store/modules/department.js'
import infoPage from '@/store/modules/infoPage.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    user,
    department,
    infoPage
  },
  strict: debug
})
