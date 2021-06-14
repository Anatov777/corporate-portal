<template>
  <div class="pb-100">
    <page-content-top class="pt-0">
      <loader v-if="mainNewsLoading" class="text-center py-5" />
      <news-main v-else-if="mainNews" :news-data="mainNews" />
    </page-content-top>
    <page-content-main class="home-content-main position-relative">
      <loader v-if="newsLoading" class="text-center py-5" />
      <news-list
          v-else
          :news="news"
          :in-home="true"
          @load-more-news="loadMoreNews"
      />
      <birthdays-block></birthdays-block>
    </page-content-main>
  </div>
</template>

<script>
import '@/styles/modules/home.scss'
import newsFilter from '@/filters/news.filter'
import http from '@/modules/http'

export default {
  name: 'Home',
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    NewsList: () => import('@/components/News/NewsList'),
    NewsMain: () => import('@/components/News/NewsMain'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    BirthdaysBlock: () => import('@/components/BirthdaysBlock')
  },
  data() {
    return {
      mainNewsLoading: true,
      mainNews: null,
      newsLoading: true,
      news: [],
      page: this.$route.params.page | 2
    }
  },
  created() {
    this.loadNews()
    this.loadMainNews()
  },
  methods: {
    async loadNews() {
      this.news = await this.fetchNews()
      this.newsLoading = false
    },
    async loadMainNews() {
      this.mainNews = await this.fetchMainNews()
      this.mainNewsLoading = false
    },
    async fetchMainNews() {
      return (await http.get('/posts/top')).data.data
    },
    async fetchNews() {
      const res = (await http.get('/posts')).data.data
      if (typeof res !== 'undefined') {
        return res.map(oneNews => newsFilter(oneNews))
      } else {
        return []
      }
    },
    async loadMoreNews() {
      this.loading = true
      try {
        const res = (await http.get(`/posts`, { params: { page: this.page } })).data.data
        const newNews = res.map(oneNews => newsFilter(oneNews))
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
