<template>
  <div>
    <page-content-top>
      <h2>Такой страницы нет :(</h2>
    </page-content-top>
    <page-content-main class="home-content-main">
      <div class="d-flex flex-gap-20">
        <base-button link="/" size="sm" rounded="pill" outline="primary">
          Домой
        </base-button>
        <base-button
          v-if="backButtonIsVisible"
          size="sm"
          rounded="pill"
          outline="primary"
          @click-btn.prevent="goBack"
        >
          Назад
        </base-button>
      </div>
    </page-content-main>
  </div>
</template>

<script>
import '@/styles/elements/_gaps.scss'

export default {
  name: 'NotFound',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain')
  },
  computed: {
    backButtonIsVisible() {
      return window.history.length > 2
    },
    backButtonStep() {
      if (this.$route.params.backButtonStep) return this.$route.params.backButtonStep
      return -1
    }
  },
  methods: {
    goBack() {
      return window.history.length > 2 ? this.$router.go(this.backButtonStep) : this.$router.push('/')
    }
  }
}
</script>
