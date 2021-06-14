<template>
  <div>
    <page-content-top class="info-tab-top">
      <div class="page-content-top-row">
        <h2 class="mb-3">
          {{ infoData.title }}
        </h2>
        <div class="page-content-top-buttons">
          <base-button
            v-if="hasEditingRights"
            rounded="pill"
            fill="primary"
            size="lg"
            @click-btn="toggleEditInfoModal('add')"
          >
            Добавить раздел
          </base-button>
          <base-button
            v-if="editButtonIsVisible"
            rounded="pill"
            fill="white"
            outline="primary"
            size="lg"
            @click-btn="toggleEditInfoModal('edit')"
          >
            Редактировать раздел
          </base-button>
        </div>
        <base-modal
          v-if="isOpenEditInfoModal"
          :is-show="isOpenEditInfoModal"
          :hasFooter="false"
          size="small"
          mode="custom"
          @close="toggleEditInfoModal"
        >
          <template slot="header">
            <span v-if="tabEditFormMode === 'add'">Добавить раздел</span>
            <span v-else>Редактировать раздел</span>
          </template>
          <template slot="body">
            <info-tab-edit-form
              :info-data.sync="infoData"
              :mode="tabEditFormMode"
              :active-tab-info="activeTabInfo"
              @update:infoData="updateInfoData($event)"
              @delete:tab="deleteTab($event)"
              @close-modal="toggleEditInfoModal"
            />
          </template>
        </base-modal>
      </div>
      <tabs
        class="mt-auto"
        :tabs="infoTabs"
        @changeTab="changeTab($event)"
        tabClass="info-tab-top-item"
        :activeTab="activeTab"
      />
    </page-content-top>
    <page-content-main class="pb-100">
      <loader v-if="isLoading" align="center" class="py-5" />
      <router-view v-else :title="activeTabTitle" :has-editing-rights="hasEditingRights"></router-view>
    </page-content-main>
  </div>
</template>

<script>
import http from '@/modules/http'
import { mapGetters, mapActions } from 'vuex'
import '@/styles/elements/transitions/_fade.scss'
import '@/styles/elements/_reset-form-btn.scss'
import '@/styles/modules/modal-form.scss'
import '@/styles/modules/info/info-tab-top.scss'
import documentMetaMixin from '@/mixins/documentMeta.mixin'

export default {
  name: 'InfoPage',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    InfoTabEditForm: () => import('@/components/Info/InfoTabEditForm'),
    Tabs: () => import('@/components/Elements/Tabs'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    Loader: () => import('@/components/Elements/Loader')
  },
  mixins: [documentMetaMixin],
  data: () => ({
    infoData: [],
    infoTabs: [],
    alias: '',
    activeTab: '',
    tabEditFormMode: 'edit',
    isOpenEditInfoModal: false,
    isLoading: true
  }),
  async created() {
    this.setAlias()
    if (this.GET_TABS_DATA !== null && this.alias !== this.GET_TABS_DATA?.alias) {
      this.SET_TABS_DATA(null)
    }
    if (!this.GET_TABS_DATA) await this.fetchInfoTabs()
    this.infoData = this.GET_TABS_DATA ? this.GET_TABS_DATA : []
    if (this.infoData?.children?.length) this.infoTabs = [...this.infoData?.children]
    else this.infoTabs = []

    this.tabAliasExistenceHandler()
    this.setInfoTabsValues()
    this.setActiveTab()
    this.setPageTitle(this.activeTabTitle)
    this.isLoading = false
  },

  computed: {
    ...mapGetters(['HAS_RIGHTS', 'GET_TABS_DATA']),
    hasEditingRights() {
      return this.HAS_RIGHTS(['page.main.manage'])
    },
    editButtonIsVisible() {
      return Object.keys(this.activeTabInfo).length && this.hasEditingRights
    },
    activeTabInfo() {
      const tabInfo = this.infoTabs?.filter(item => item?.alias === this.activeTab)
      if (tabInfo[0]) return tabInfo[0]
      else return {}
    },
    activeTabTitle() {
      if (this.activeTabInfo?.title) return this.activeTabInfo.title
      else if (this.infoData?.title) return this.infoData.title
      else return ''
    }
  },
  methods: {
    ...mapActions(['SET_TABS_DATA', 'SET_TABS_ITEM_DATA', 'DELETE_TABS_ITEM_DATA']),
    setAlias() {
      this.alias = this.$route.params.pageAlias
    },
    setInfoTabsValues() {
      this.infoTabs?.map(item => (item.value = item.alias))
    },
    setActiveTab() {
      let tabsValues = this.infoTabs.map(tab => tab.value)
      let routePathSplitted = this.$route.path.split('/')
      let lastPath = routePathSplitted[routePathSplitted.length - 1]

      if (tabsValues.includes(lastPath)) {
        this.activeTab = lastPath
      }
    },
    async fetchInfoTabs() {
      await http
        .get(`/info/${this.alias}`)
        .then(response => {
          this.SET_TABS_DATA(response.data.data)
        })
        .catch(error => {
          if (error.response.status === 404)
            this.$router.push({ name: 'notFound', params: { backButtonStep: -2 } })
        })
    },
    toggleEditInfoModal(modalMode = 'edit') {
      if (modalMode === 'add') this.tabEditFormMode = 'add'
      if (modalMode === 'edit') this.tabEditFormMode = 'edit'
      this.isOpenEditInfoModal = !this.isOpenEditInfoModal
    },
    changeTab(tabName) {
      if (
        (this.$route.path !== `/info/${this.alias}/${tabName}` &&
          this.hasTabAlias(this.$route.params.tabAlias)) ||
        !this.$route.params.tabAlias
      ) {
        this.$router.push({ name: 'InfoPageTab', params: { tabAlias: tabName } })
      }
    },
    updateInfoData(data) {
      if (data.mode === 'edit') {
        this.SET_TABS_ITEM_DATA(data.tabData)
      } else {
        this.SET_TABS_DATA(data)
      }
      this.infoData = this.GET_TABS_DATA
      this.infoTabs = [...this.infoData?.children]
    },
    deleteTab(tabId) {
      const tabToDelete = this.infoData.children.filter(element => element.id === tabId)
      this.DELETE_TABS_ITEM_DATA(tabToDelete[0])
      this.infoData = this.GET_TABS_DATA ? this.GET_TABS_DATA : []
      this.infoTabs = [...this.infoData?.children]
      if (this.infoTabs.length) {
        const newActiveTab = this.infoTabs[0].alias
        this.$router.push({ name: 'InfoPageTab', params: { tabAlias: newActiveTab } })
      }
    },
    toNotFoundPage() {
      this.$router.push({ name: 'notFound', params: { backButtonStep: -2 } })
    },
    tabAliasExistenceHandler() {
      if (this.$route.params.tabAlias) {
        let hasTabAlias = this.GET_TABS_DATA.children.filter(item => {
          return item?.alias === this.$route.params.tabAlias
        }).length
        if (!hasTabAlias) {
          this.toNotFoundPage()
        }
      }
    },
    hasTabAlias(tabName) {
      return this.GET_TABS_DATA.children.filter(item => {
        return item?.alias === tabName
      }).length
    }
  }
}
</script>
