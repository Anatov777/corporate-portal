<template>
  <div>
    <page-content-top class="pt-0">
      <div class="d-flex justify-content-between align-items-center">
        <div class="news-content-top__left">
          <h2 class="news-content-top__title">
            Архив новостей и событий
          </h2>
          <tabs
            :tabs="years"
            :active-tab="currentYear"
            @changeTab="changeTab($event)"
            tabClass="news-tab-item"
          />
        </div>
        <div class="news-content-top__right">
          <base-button v-if="canEdit" rounded="pill" fill="primary" size="lg" @click-btn="toggleAddNewsModal">
            добавить новость/событие
          </base-button>
        </div>
      </div>

      <base-modal
        v-if="isOpenAddNewsModal"
        :is-show="isOpenAddNewsModal"
        :hasFooter="false"
        size="medium"
        mode="custom"
        @close="toggleAddNewsModal"
      >
        <template slot="header">
          Добавить новость/событие
        </template>
        <template slot="body">
          <news-edit-form
            :news-types.sync="newsTypes"
            :event-types.sync="eventTypes"
            :employees.sync="employees"
            :news.sync="news"
            @close-modal="toggleAddNewsModal"
          />
        </template>
      </base-modal>
    </page-content-top>
    <page-content-main class="news-content-main">
      <loader align="center" class="py-5" v-if="newsLoading" />
      <news-list :news="news" :no-more-news="noMoreNews" @load-more-news="loadMoreNews" class="pb-0" v-else />
    </page-content-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import '@/styles/modules/news.scss'
import http from '@/modules/http'
import newsFilter from '@/filters/news.filter'
export default {
  name: 'NewsPage',
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    Tabs: () => import('@/components/Elements/Tabs'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    NewsList: () => import('@/components/News/NewsList'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    NewsEditForm: () => import('@/components/News/NewsEditForm')
  },
  data() {
    return {
      isOpenAddNewsModal: false,
      newsLoading: true,
      news: [],
      noMoreNews: false,
      currentYear: 0,
      years: [],
      page: this.$route.query.page | 2,
      newsTypes: [],
      eventTypes: [],
      employees: []
    }
  },
  async created() {
    let newsUrlYear = this.$route.params.year
    if (newsUrlYear && !isNaN(+newsUrlYear)) {
      await this.fetchNewsByYear(+newsUrlYear)
    } else {
      await this.fetchNews()
    }
  },
  computed: {
    ...mapGetters(['HAS_API_ACCESS']),
    canEdit() {
      return this.HAS_API_ACCESS({
        apiName: 'posts',
        method: 'post'
      })
    }
  },
  methods: {
    toggleAddNewsModal() {
      this.isOpenAddNewsModal = !this.isOpenAddNewsModal
    },
    async changeTab(year) {
      this.newsLoading = true
      this.noMoreNews = false
      await this.$router.push({ path: `/news/${year}` }).catch(() => {})
      this.currentYear = year
      this.page = 2
      const res = (await http.get(`/posts/archive/${year}`)).data.data
      this.news = res[year].map(oneNews => newsFilter(oneNews))
      this.newsLoading = false
    },
    async fetchNews() {
      this.newsLoading = true
      const res = (await http.get('/posts/archive')).data.data
      this.setNewsAndYears(res)
    },
    async fetchNewsByYear(year) {
      this.newsLoading = true
      this.noMoreNews = false
      await this.$router.push({ path: `/news/${year}` }).catch(() => {})
      this.currentYear = year
      this.page = 2
      const res = (await http.get(`/posts/archive/${year}`)).data.data
      this.setNewsAndYears(res)
      this.newsLoading = false
    },
    setNewsAndYears(data) {
      this.years = Object.keys(data)
        .sort((a, b) => b - a)
        .map(year => ({ title: +year }))
      this.news = data[this.years[0].title].map(oneNews => newsFilter(oneNews))
    },
    async loadMoreNews() {
      this.loading = true
      try {
        const res = (await http.get(`/posts/archive/${this.currentYear}`, { params: { page: this.page } }))
          .data.data
        let newNews
        let currentYearNews = res[this.currentYear]
        let lastYearNews = res[this.currentYear - 1]
        if (lastYearNews) {
          if (!currentYearNews.length && !lastYearNews.length) {
            this.noMoreNews = true
            return
          }
        } else {
          this.noMoreNews = true
          return
        }
        /* Когда долистываем до конца года и новостей не хватает до 8, поэтому забираем новости из пред. года */
        if (currentYearNews.length < 8 && lastYearNews.length) {
          newNews = [...currentYearNews, ...lastYearNews]
        } else {
          newNews = currentYearNews
        }
        newNews = newNews.map(oneNews => newsFilter(oneNews))
        this.news.push(...newNews)
        this.page++
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
