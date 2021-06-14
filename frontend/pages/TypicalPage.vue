<template>
  <div>
    <page-content-top class="d-flex">
      <div class="d-flex justify-content-between flex-wrap p-3">
        <h2>{{ pageTitle }}</h2>
        <div class="edit-btns">
          <base-button
            v-if="canEdit && pageAlias"
            class="news__btn"
            fill="primary"
            rounded="pill"
            @click-btn="openEditForm"
          >
            Редактировать страницу
          </base-button>
          <base-button
            v-if="canEdit"
            class="news__btn ml-20"
            fill="primary"
            rounded="pill"
            @click-btn="openAddForm"
          >
            Добавить страницу
          </base-button>
        </div>
      </div>
    </page-content-top>
    <page-content-main class="pb-100">
      <div v-html="pageText"></div>
    </page-content-main>
    <div v-if="addFormOpened">
      <typical-page-create
        :insertedAlias="''"
        :insertedTitle="''"
        :insertedText="''"
        @open-add-form="openAddForm"
      />
    </div>
    <div v-if="editFormOpened">
      <typical-page-create
        :insertedAlias.sync="pageAlias"
        :insertedTitle.sync="pageTitle"
        :insertedText.sync="pageText"
        @open-add-form="openEditForm"
      />
    </div>
  </div>
</template>

<script>
import http from '@/modules/http'
import '@/styles/modules/news.scss'
import '@/styles/modules/typical-page.scss'
import { mapGetters } from 'vuex'
import documentMetaMixin from '@/mixins/documentMeta.mixin'

export default {
  name: 'TypicalPage',
  components: {
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    TypicalPageCreate: () => import('@/components/TypicalPageCreate')
  },
  mixins: [documentMetaMixin],
  data: () => ({
    pageData: {},
    addFormOpened: false,
    editFormOpened: false,
    pageAlias: '',
    pageTitle: '',
    pageText: ''
  }),
  async created() {
    await this.fetchPageData()
  },
  computed: {
    ...mapGetters(['HAS_API_ACCESS']),
    canEdit() {
      return this.HAS_API_ACCESS({
        apiName: 'pages',
        method: 'patch'
      })
    }
  },
  methods: {
    async fetchPageData() {
      const alias = this.$route.params.alias
      this.pageData = (await http.get(`/pages/${alias}`)).data.data
      this.pageAlias = this.pageData.alias
      this.pageTitle = this.pageData.title
      this.pageText = this.pageData.text
      this.setPageTitle(this.pageTitle)
    },
    openAddForm() {
      this.addFormOpened = !this.addFormOpened
    },
    openEditForm() {
      this.editFormOpened = !this.editFormOpened
    }
  }
}
</script>
