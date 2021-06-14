const state = {
  departmentId: null
}

const getters = {
  GET_DEPARTMENT_ID: state => state.departmentId
}

const actions = {
  SET_DEPARTMENT_ID(context, id) {
    context.commit('CHANGE_DEPARTMENT_ID', id)
  }
}

const mutations = {
  CHANGE_DEPARTMENT_ID: (state, id) => {
    state.departmentId = id
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
