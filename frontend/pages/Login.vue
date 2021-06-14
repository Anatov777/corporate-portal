<template>
  <div>
    <page-content-top class="login-content-top">
      <h2>
        Вход
      </h2>
    </page-content-top>
    <page-content-main class="login-content-main">
      <login-form v-show="!IS_LOGIN" @form:sent="redirect" />
      <div v-if="IS_LOGIN">
        Вы уже авторизованы!
      </div>
    </page-content-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import('@/styles/modules/login.scss')

export default {
  name: 'Login',
  components: {
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    LoginForm: () => import('@/components/LoginForm')
  },
  computed: {
    ...mapGetters(['IS_LOGIN']),
    redirectUrl() {
      return this.$route.query.redirect || this.$route.params.redirect
    }
  },
  methods: {
    redirect() {
      if (this.redirectUrl && this.redirectUrl !== '/') {
        this.$router.push(this.redirectUrl)
      } else {
        this.goHome()
      }
    },
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>
