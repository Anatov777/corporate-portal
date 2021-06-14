import Vue from 'vue'

const state = {
  tabsData: null,
  blocksData: null
}

const getters = {
  GET_TABS_DATA: state => state.tabsData,
  GET_BLOCKS_DATA: state => state.blocksData
}

const actions = {
  SET_TABS_DATA(context, data) {
    context.commit('CHANGE_TABS_DATA', data)
  },
  SET_TABS_ITEM_DATA(context, data) {
    context.commit('CHANGE_TABS_ITEM_DATA', data)
  },
  DELETE_TABS_ITEM_DATA(context, data) {
    context.commit('DELETE_TAB', data)
  },
  SET_BLOCKS_DATA(context, data) {
    context.commit('CHANGE_BLOCKS_DATA', data)
  },
  SET_BLOCK_ITEM_DATA(context, data) {
    context.commit('CHANGE_BLOCK_ITEM_DATA', data)
  },
  DELETE_BLOCK_ITEM_DATA(context, data) {
    context.commit('DELETE_BLOCK', data)
  }
}

const mutations = {
  CHANGE_TABS_DATA: (state, data) => {
    if (!state.tabsData || data === null) state.tabsData = data
    else state.tabsData.children.push(data)
  },
  CHANGE_TABS_ITEM_DATA: (state, data) => {
    const index = state.tabsData?.children.findIndex(item => item.id === data.id)
    state.tabsData?.children.splice(index, 1, data)
  },
  DELETE_TAB: (state, data) => {
    const index = state.tabsData?.children.findIndex(item => item.id === data.id)
    state.tabsData?.children.splice(index, 1)
  },
  CHANGE_BLOCKS_DATA: (state, data) => {
    if (!state.blocksData) {
      state.blocksData = []
      data.forEach((element, index) => {
        Vue.set(state.blocksData, index, element)
      })
    } else {
      state.blocksData?.splice(state.blocksData.length, 0, data)
    }
  },
  CHANGE_BLOCK_ITEM_DATA: (state, data) => {
    const index = state.blocksData.findIndex(item => item.id === data.id)
    state.blocksData.splice(index, 1, data)
  },
  DELETE_BLOCK: (state, data) => {
    const index = state.blocksData.findIndex(item => item.id === data.id)
    state.blocksData.splice(index, 1)
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
