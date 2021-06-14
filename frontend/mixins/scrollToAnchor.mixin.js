export default {
  methods: {
    scrollToAnchor() {
      if (this.$route.hash) {
        this.$nextTick(() => {
          const element = document.querySelector(this.$route.hash)
          element && element.scrollIntoView({ behavior: 'smooth' })
        })
      }
    }
  }
}
