<template>
  <div class="news">
    <div class="d-flex justify-content-between flex-wrap flex-gap-20 mb-30">
      <h3>{{ title }}</h3>
      <info-block-edit-button-modal v-if="hasEditingRights" :attached-files.sync="attachedFiles" mode="add" />
    </div>

    <div v-if="blockTags.length" class="filter-buttons">
      <div
        v-for="tag in blockTags"
        :key="tag"
        class="filter-buttons-item"
        :class="{ active: activeTag === tag }"
        @click="toggleTagFilter(tag)"
      >
        {{ tag }}
      </div>
    </div>

    <info-block-item
      v-for="block in activeTabBlocksDataFiltered"
      :key="`${block.id}`"
      :block-data="block"
      :has-editing-rights="hasEditingRights"
      @delete:block="deleteBlock($event)"
    />
  </div>
</template>

<script>
import http from '@/modules/http'
import '@/styles/elements/_gaps.scss'
import '@/styles/modules/filter-buttons.scss'
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'

export default {
  name: 'InfoBlockList',
  components: {
    InfoBlockItem: () => import('@/components/Info/InfoBlockItem'),
    InfoBlockEditButtonModal: () => import('@/components/Info/InfoBlockEditButtonModal')
  },
  props: {
    title: {
      type: String
    },
    hasEditingRights: {
      type: Boolean
    }
  },
  data() {
    return {
      attachedFiles: [],
      activeTabBlocksData: [],
      activeTag: ''
    }
  },
  async created() {
    if (!this.GET_BLOCKS_DATA) this.fetchInfoBlocks()
    this.setActiveTabBlocksData()
  },
  watch: {
    GET_BLOCKS_DATA() {
      this.setActiveTabBlocksData()
    }
  },
  computed: {
    ...mapGetters(['GET_BLOCKS_DATA', 'GET_TABS_DATA']),
    blockTags() {
      let tags = []
      this.activeTabBlocksData.forEach(item => {
        let tagsArray = [...item.tag.split(';')]
        tagsArray = tagsArray.filter(element => element !== '')
        tagsArray = this.trimArrayItem(tagsArray)
        tags.push(...tagsArray)
      })
      if ([...new Set(tags)][0]) return [...new Set(tags)]
      return []
    },
    activeTabBlocksDataFiltered() {
      return this.activeTabBlocksData.filter(item => {
        let tagsArray = [...item.tag.split(';')]
        tagsArray = this.trimArrayItem(tagsArray)
        if (tagsArray.includes(this.activeTag)) return item
        if (!this.activeTag) return item
      })
    }
  },
  methods: {
    ...mapActions(['SET_BLOCKS_DATA', 'DELETE_BLOCK_ITEM_DATA']),
    async fetchInfoBlocks() {
      await http.get(`/info/blocks`).then(response => {
        this.SET_BLOCKS_DATA(response.data.data)
      })
    },
    setActiveTabBlocksData() {
      let data = this.GET_BLOCKS_DATA?.filter(item => item.owner?.alias === this.$route.params.tabAlias)
      data?.forEach((element, index) => {
        Vue.set(this.activeTabBlocksData, index, element)
      })
    },
    toggleTagFilter(tag) {
      tag === this.activeTag ? (this.activeTag = '') : (this.activeTag = tag)
    },
    trimArrayItem(array) {
      return array.map(element => {
        return element.trim()
      })
    },
    async deleteBlock(blockId) {
      let blockIndex = this.activeTabBlocksData.findIndex(item => item.id === blockId)
      let blockToDelete = this.GET_BLOCKS_DATA.filter(item => item.id === blockId)
      this.activeTabBlocksData.splice(blockIndex, 1)
      this.DELETE_BLOCK_ITEM_DATA(blockToDelete[0])
    }
  }
}
</script>
