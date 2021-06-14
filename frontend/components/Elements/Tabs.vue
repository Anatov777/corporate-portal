<template>
  <div class="tab-list" @click="tabsHandler($event)">
    <div
      v-for="(tab, index) in items"
      :key="tab.value"
      :data-index="index"
      :data-tab="tab.value"
      class="tab-item"
      :class="[{ 'is-active': currentTab === tab.value }, tabClass]"
    >
      {{ tab.title }}
    </div>
  </div>
</template>

<script>
import '@/styles/elements/_tab.scss'
export default {
  name: 'Tabs',
  props: {
    tabs: {
      type: Array,
      default: () => [] // [ { title: 'Таб 1', value: 'Tab1'} ] или [ { title: 2020 } ]
    },
    tabClass: {
      type: String
    },
    activeTab: {
      type: [String, Number]
    }
  },
  data: () => ({
    currentTab: ''
  }),
  created() {
    // Признак статических табов, у которых не надо ждать, когда они загрузятся
    if (this.items.length) {
      this.currentTab = this.activeTab ? this.activeTab : this.items[0].value
      this.$emit('changeTab', this.currentTab)
    }
    this.unwatchActiveTab = this.$watch('items', tabs => {
      if (tabs.length) {
        // Можно оставить только тернарник после if, но так нагляднее
        if (this.activeTab) {
          this.currentTab =
            this.items.some(item => item.title === this.activeTab) ||
            this.items.some(item => item.value === this.activeTab)
              ? this.activeTab
              : this.items[0].value
        } else {
          this.currentTab = this.items[0].value
        }
        this.$emit('changeTab', this.currentTab)
        this.unwatchActiveTab()
      }
    })
  },
  computed: {
    items() {
      if (!this.tabs.length || typeof this.tabs[0]?.title !== 'number') {
        return this.tabs
      }
      return this.tabs.map(item => {
        item.value = item.title
        return item
      })
    }
  },
  methods: {
    tabsHandler(event) {
      if (!event.target.dataset.index) return
      const tab = this.items[event.target.dataset.index]
      this.currentTab = tab.value
      this.$emit('changeTab', this.currentTab)
    }
  }
}
</script>
