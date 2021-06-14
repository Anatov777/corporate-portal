<template>
  <div v-if="lastNews.length" class="pt-100 pb-50">
    <div class="container">
      <div class="d-flex justify-content-between mb-20">
        <h2>Последние новости</h2>
        <router-link class="text text-hover text--sm" to="/news">Архив новостей и событий</router-link>
      </div>
      <div class="news-row row mb-50">
        <news-card v-for="item in lastNews" :key="item.id" :news-data="item" />
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/modules/http'
import newsFilter from '@/filters/news.filter'

export default {
  name: 'NewsLatest',
  components: {
    NewsCard: () => import('@/components/News/NewsCard')
  },
  props: {
    newsId: {
      type: String
    }
  },
  data() {
    return {
      lastNews: []
    }
  },
  async created() {
    await this.fetchLatestNews()
  },
  methods: {
    async fetchLatestNews() {
      const lastNewsData = (await http.get('/posts?limit=4', { params: { exclude: this.newsId } })).data.data
      const lastNews = lastNewsData.map(oneNews => newsFilter(oneNews))
      this.lastNews = lastNews
    }
  }
}
</script>
