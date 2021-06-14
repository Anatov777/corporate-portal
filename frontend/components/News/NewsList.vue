<template>
  <div class="news">
    <div class="news-row row">
      <news-card v-for="item in news" :key="item.id" :news-data="item" :show-image="!inHome" />
    </div>
    <div class="d-flex justify-content-center" v-if="!noMoreNews">
      <base-button
        class="news__btn"
        fill="primary"
        rounded="pill"
        :disabled="loading"
        @click-btn="loadMoreNews"
      >
        Больше новостей и событий
        <loader v-if="loading" size="sm" align="center" class="ml-2" color="white" />
      </base-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    NewsCard: () => import('@/components/News/NewsCard'),
    BaseButton: () => import('@/components/Elements/BaseButton')
  },
  name: 'NewsList',
  props: {
    news: {
      type: Array
    },
    noMoreNews: {
      type: Boolean,
      default: true
    },
    inHome: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    loadMoreNews() {
      this.loading = true
      this.$emit('load-more-news')
    }
  },
  watch: {
    news() {
      this.loading = false
    }
  }
}
</script>
