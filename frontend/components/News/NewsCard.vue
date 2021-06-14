<template>
  <div class="col-xl-4 col-lg-4 col-md-6 news-card-wrap d-flex flex-column">
    <div class="news-card d-flex flex-column flex-grow-1 position-relative" :class="eventCardClass">
      <div class="d-flex justify-content-between align-items-start news-card-top" :style="backgroundImage">
        <div
          class="d-flex align-items-center news-card-date"
          :class="{ 'news-card-date--grey': newsData.image }"
        >
          <span class="day mr-2">{{ newsData.day }}</span>
          <div class="d-flex flex-column">
            <span class="month">{{ newsData.month }}</span>
            <span class="year">{{ newsData.year }}</span>
          </div>
        </div>
        <span v-if="label" class="news-card-label label" :class="labelColor">
          {{ label }}
        </span>
        <img
          v-if="isEventNews"
          :src="require(`@/assets/event/${eventImageName}`)"
          class="news-card-event-image"
        />
      </div>
      <div class="news-card-body flex-grow-1 d-flex flex-column">
        <div v-if="isEventNews && newsData.employees" class="d-flex mb-20 flex-gap-12">
          <div
            v-for="employee in newsData.employees"
            :key="employee.id"
            :style="{ 'background-image': `url(${employee.photo})` }"
            :title="`${employee.surname} ${employee.name}`"
            class="news-card-person-image rounded-circle"
          ></div>
        </div>
        <h3 class="news-card-title" :class="{ 'mb-0': isEventNews }" ref="newsTitle">
          {{ newsData.title_preview ? newsData.title_preview : newsData.title }}
        </h3>
        <p v-if="newsText && !isEventNews" class="news-card-text" v-html="newsText"></p>
      </div>
      <div class="d-flex justify-content-between news-card-bottom">
        <base-button class="news-card-link" :link="`/news/view/${newsData.id}`" outline="dark">
          Подробнее
        </base-button>
        <div class="news-card-statistics statistic-news">
          <!-- <div v-if="!isEventNews" class="news-card-views statistic-news__item">
            <svg-icon class="mr-1" name="views" title="просмотры" />
            {{ newsData.views }}
          </div> -->
          <div
            v-if="newsData.comments_count"
            class="news-card-comments statistic-news__item"
            role="button"
            @click="toPostComments"
          >
            <svg-icon
              :class="{ 'text-white': isEventNews }"
              class="mr-2"
              name="comments"
              title="комментарии"
              has-hover
            />
            {{ newsData.comments_count }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import labelNewsTypes from '@/config/labelNewsTypes'
import newsMixin from '@/mixins/news.mixin'
import '@/styles/elements/_gaps.scss'

const MAX_TEXT_TRIM_LENGTH = 140

export default {
  name: 'NewsCard',
  components: {
    SvgIcon: () => import('@/components/Elements/SvgIcon'),
    BaseButton: () => import('@/components/Elements/BaseButton')
  },
  props: {
    newsData: {
      type: Object
    },
    showImage: {
      type: Boolean
    }
  },
  mixins: [newsMixin],
  data() {
    return {
      titleElement: null
    }
  },
  mounted() {
    this.titleElement = this.$refs.newsTitle
  },
  computed: {
    ...mapGetters(['HAS_API_ACCESS']),
    canEdit() {
      //пост может редактировать владелец до того как он опубликован, либо тот у кого есть права
      return this.HAS_API_ACCESS({
        apiName: 'posts',
        method: 'patch'
      })
    },
    label() {
      if (!this.newsData.category) {
        return null
      }
      return this.newsData.category.title
    },
    labelColor() {
      if (!this.newsData.category) {
        return null
      }
      if (!labelNewsTypes[this.newsData.category.id]) {
        return 'bg-secondary'
      }
      return labelNewsTypes[this.newsData.category.id].class
    },
    eventCardClass() {
      return this.isEventNews ? 'bg-indigo text-white news-card--event' : ''
    },
    backgroundImage() {
      if (!this.showImage) {
        return ''
      }
      return `background-image: url(${this.newsData.image})`
    },
    newsTitleLines() {
      if (!this.titleElement) {
        return 0
      }
      const computedStyle = window.getComputedStyle(this.titleElement)
      const lineHeight = parseInt(computedStyle.lineHeight, 10)
      return Math.round(this.titleElement.offsetHeight / lineHeight)
    },
    textTrimLength() {
      if (this.newsTitleLines === 0) {
        return null
      }
      if (this.newsTitleLines <= 2) {
        return MAX_TEXT_TRIM_LENGTH
      }
      return MAX_TEXT_TRIM_LENGTH - 2 * (MAX_TEXT_TRIM_LENGTH / this.newsTitleLines)
    },
    newsText() {
      if (!this.textTrimLength) {
        return this.newsData.text
      }
      const text = this.newsData.text
      return text.length > this.textTrimLength ? text.substring(0, this.textTrimLength) + '...' : text
    }
  },
  methods: {
    toPostComments() {
      this.$router.push({ path: `/news/view/${this.newsData.id}`, hash: `comments` })
    }
  }
}
</script>

<style scoped>
@media (min-width: 1366px) {
  .col-xl-4 {
    flex: 0 0 25%;
    max-width: 25%;
  }
}
</style>
