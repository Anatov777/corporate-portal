<template>
  <div id="app" class="app-wrap">
    <Header />
    <router-view :key="$route.path" />
    <Footer />
  </div>
</template>

<script>
import '@/styles/elements/_background.scss'
import '@/styles/modules/page.scss'
import '@/styles/modules/header.scss'
import '@/styles/modules/footer.scss'

export default {
  name: 'App',
  components: {
    Header: () => import('@/components/Common/Header'),
    Footer: () => import('@/components/Common/Footer')
  },
  created() {
    this.addKeydownListenerToRoot()
  },
  computed: {},
  methods: {
    addKeydownListenerToRoot() {
      const $root = this.$root
      document.addEventListener('keydown', e => {
        if (e.code === 'Enter') {
          $root.$emit('keydown:enter')
        } else if (e.code === 'Escape') {
          $root.$emit('keydown:esc')
        }
      })
    }
  }
}
</script>
