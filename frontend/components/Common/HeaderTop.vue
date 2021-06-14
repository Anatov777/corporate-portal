<template>
  <div
    class="container position-relative d-flex justify-content-between align-items-center py-3"
    ref="headerTopWrap"
  >
    <router-link class="header__logo" to="/">
      <img src="@/assets/logo.png" alt="Нейропортал" />
    </router-link>
    <base-button v-if="totalEmployees" class="header__statistics" fill="purple" link="/info/statistics">
      <span class="header__statistics-icon"></span>
      Нас уже <span class="header__statistics--lg">{{ totalEmployees }}</span>
    </base-button>
    <div class="header__right d-flex align-items-center">
      <router-link to="/schedule/meeting" class="header__meeting" ref="headerMeeting">
        Переговорные
      </router-link>
      <loader v-show="showLoaderForUser" />
      <div v-show="!showLoaderForUser">
        <div
          v-if="!HAVE_AUTH_USER"
          class="border rounded-0 btn header__login login text-center d-flex align-items-center"
          data-toggle="modal"
          @click="toggleModalLogin"
        >
          <svg-icon class="header__login-icon" name="person" />
          Войти
        </div>
        <div v-else>
          <div class="d-flex flex-column header-profile">
            <router-link
              :class="{ 'is-toggle': isToggleDropdownProfile }"
              class="header-profile__name"
              :to="`/employee/account/${authUserId}`"
            >
              <span class="header-profile__name-text text-underline-under">{{ authUser }}</span>
              <span
                ref="headerProfileName"
                class="header-profile__arrow-wrapper"
                @click.prevent="toggleDropdownProfile"
              >
                <span
                  class="arrow ml-10"
                  :class="{ 'arrow--down': !isToggleDropdownProfile, 'arrow--up': isToggleDropdownProfile }"
                ></span>
              </span>
            </router-link>
            <div
              :class="{ 'is-toggle': isToggleDropdownProfile }"
              class="d-flex flex-column header-profile__dropdown"
              ref="headerProfile"
            >
              <button
                type="button"
                class="btn btn-link d-inline-block text-left text-dark header-profile__item header-profile__logout text-underline-under"
                @click="logout"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <base-modal
      v-show="!HAVE_AUTH_USER"
      :is-show="isOpenModalLogin"
      mode="custom"
      :has-footer="false"
      @close="toggleModalLogin"
    >
      <template v-slot:header>
        Вход
      </template>
      <template v-slot:body>
        <login-form v-if="isOpenModalLogin" @form:sent="toggleModalLogin" />
      </template>
    </base-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import http from '@/modules/http'

export default {
  name: 'HeaderTop',
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    SvgIcon: () => import('@/components/Elements/SvgIcon'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    LoginForm: () => import('@/components/LoginForm')
  },
  data: () => ({
    isToggleDropdownProfile: false,
    totalEmployees: null,
    isOpenModalLogin: false
  }),
  computed: {
    ...mapGetters(['HAVE_AUTH_USER', 'AUTH_USER', 'USER_LOADING_COMPLETE']),
    authUser() {
      if (!this.HAVE_AUTH_USER) {
        return null
      }
      return this.AUTH_USER.login
    },
    authUserId() {
      if (!this.HAVE_AUTH_USER) {
        return null
      }
      return this.AUTH_USER.employee.id
    },
    showLoaderForUser() {
      return !this.HAVE_AUTH_USER && !this.USER_LOADING_COMPLETE
    }
  },
  async created() {
    await this.fetchTotalEmployees()
  },
  mounted() {
    this.setProfileDropdownListener()
  },
  beforeDestroy() {
    this.unwatch()
  },
  methods: {
    ...mapActions(['AUTH_LOGOUT']),
    async logout() {
      await this.AUTH_LOGOUT()
    },
    async fetchTotalEmployees() {
      this.totalEmployees = (await http.get('/employees/statistics')).data.data
      if (typeof this.totalEmployees !== 'undefined') {
        this.totalEmployees = this.totalEmployees.total
      }
    },
    toggleDropdownProfile() {
      this.isToggleDropdownProfile = !this.isToggleDropdownProfile
    },
    setProfileDropdownListener() {
      document.addEventListener('click', item => {
        if (
          this.isToggleDropdownProfile &&
          item.target.closest('.header-profile__arrow-wrapper') !== this.$refs['headerProfileName']
        ) {
          this.toggleDropdownProfile()
        }
      })
    },
    toggleModalLogin() {
      this.isOpenModalLogin = !this.isOpenModalLogin
    }
  }
}
</script>
