<template>
  <div class="main-news d-flex align-items-center row" @click="toMainNewsPage($event)">
    <div class="main-news-text col">
      <h1 class="main-news__title" v-html="newsData.title" />
      <router-link class="main-news__link" :to="`/news/view/${newsData.id}`">
        Подробнее
      </router-link>
    </div>
    <div class="col-lg-7 d-flex justify-content-end">
      <base-image
        v-if="isEventNews"
        :image-path="require(`@/assets/event/${eventImageName}`)"
        :imageAlt="newsData.title"
        class="post-image-event bg-indigo"
      />
      <base-image v-else :image-path="newsData.image" :imageAlt="newsData.title" />
    </div>
  </div>
</template>

<script>
import newsMixin from '@/mixins/news.mixin'
import '@/styles/modules/news-item.scss'

export default {
  name: 'NewsMain',
  props: {
    newsData: {
      type: Object
    }
  },
  mixins: [newsMixin],
  components: {
    BaseImage: () => import('@/components/Elements/BaseImage')
  },
  methods: {
    toMainNewsPage(event) {
      if (event.target.tagName !== 'A') {
        this.$router.push({ path: `/news/view/${this.newsData.id}` })
      }
    }
  }
}
</script>
