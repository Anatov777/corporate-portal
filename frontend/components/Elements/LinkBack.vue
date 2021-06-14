<template>
  <div>
    <h2 class="link-back-title" @click="goBack">
      <span class="arrow arrow--left link-back-arrow"></span>
      <slot>Назад</slot>
    </h2>
  </div>
</template>

<script>
import '@/styles/elements/_link-back.scss'

export default {
  name: 'LinkBack',
  methods: {
    goBack() {
      return window.history.length > 2 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}
</script>
