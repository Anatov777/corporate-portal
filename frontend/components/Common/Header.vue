<template>
  <header class="header">
    <HeaderTop />
    <HeaderBottom />
  </header>
</template>

<script>
export default {
  name: 'Header',
  components: {
    HeaderTop: () => import('@/components/Common/HeaderTop'),
    HeaderBottom: () => import('@/components/Common/HeaderBottom')
  },
  methods: {
    setTitle() {
      this.$route.meta.metaTitle ? (document.title = this.$route.meta.metaTitle) : ''
    }
  },
  watch: {
    $route() {
      this.setTitle()
    }
  }
}
</script>
