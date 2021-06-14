<template>
  <div>
    <page-content-top class="pt-0">
      <div class="d-flex justify-content-between align-items-center">
        <div class="news-content-top__left">
          <h2 class="news-content-top__title">
            Доска объявлений
          </h2>
        </div>
        <div class="news-content-top__right">
          <base-button
            v-if="canEdit"
            rounded="pill"
            fill="primary"
            size="lg"
            @click-btn="toggleAddAnnounceModal"
          >
            Добавить объявление
          </base-button>
        </div>
      </div>

      <base-modal
        v-if="isOpenAddAnnounceModal"
        :is-show="isOpenAddAnnounceModal"
        :hasFooter="false"
        size="medium"
        mode="custom"
        @close="toggleAddAnnounceModal"
      >
        <template slot="header">
          Объявление
        </template>
        <template slot="body">
          <news-edit-form
            :news.sync="announcementsData"
            :news-types="newsCategory"
            @close-modal="toggleAddAnnounceModal"
          />
        </template>
      </base-modal>
    </page-content-top>
    <page-content-main class="news-content-main">
      <loader v-if="loading" class="py-5" align="center" />
      <news-list v-else :news="announcementsData" class="pb-0" />
    </page-content-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import '@/styles/modules/news.scss'
import http from '@/modules/http'
import newsFilter from '@/filters/news.filter'

export default {
  name: 'NewsBillboard',
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    NewsList: () => import('@/components/News/NewsList'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    NewsEditForm: () => import('@/components/News/NewsEditForm')
  },
  data() {
    return {
      isOpenAddAnnounceModal: false,
      announcementsData: [],
      loading: false
    }
  },
  async created() {
    await this.fetchAnnouncements()
  },
  computed: {
    ...mapGetters(['HAS_API_ACCESS']),
    canEdit() {
      return this.HAS_API_ACCESS({
        apiName: 'posts',
        method: 'post'
      })
    },
    newsCategory() {
      return [{ id: 3, title: 'Объявление' }]
    }
  },
  methods: {
    toggleAddAnnounceModal() {
      this.isOpenAddAnnounceModal = !this.isOpenAddAnnounceModal
    },
    async fetchAnnouncements() {
      this.loading = true
      const announcements = (await http.get(`/posts/billboard`))?.data?.data
      this.announcementsData = announcements.map(item => newsFilter(item))
      this.loading = false
    }
  }
}
</script>
