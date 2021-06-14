<template>
  <form class="login-form" @submit.prevent="login">
    <div class="form-group login-form-group">
      <label class="login-label">Логин</label>
      <input
        v-model="$v.username.$model"
        type="text"
        name="login"
        class="form-control login-input"
        :class="{ 'is-invalid': $v.username.$error }"
        autocomplete="on"
        v-focus
      />
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.username.required && $v.username.$error"
    >
      <small class="col-10">Поле "Логин" обязательно для заполнения.</small>
    </div>
    <div class="form-group login-form-group">
      <label class="login-label">Пароль</label>
      <input
        v-model="$v.password.$model"
        type="password"
        name="password"
        class="form-control login-input"
        :class="{ 'is-invalid': $v.password.$error }"
        autocomplete="off"
      />
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.password.required && $v.password.$error"
    >
      <small class="col-10">Поле "Пароль" обязательно для заполнения.</small>
    </div>
    <div class="text-danger pb-2 row justify-content-end" v-show="showServerError">
      <small class="col-10">{{ serverError }}.</small>
    </div>
    <div class="d-flex justify-content-end mt-5">
      <base-button size="lg" rounded="pill" fill="primary" :disabled="$v.$invalid" type="submit">
        Войти
        <span v-if="sending" class="spinner-border spinner-border-sm text-white ml-2"></span>
      </base-button>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import('@/styles/modules/login.scss')

export default {
  name: 'LoginForm',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton')
  },
  props: {},
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  data: () => ({
    username: null,
    password: null,
    sending: false,
    serverError: null
  }),
  validations() {
    return {
      password: {
        required
      },
      username: {
        required
      }
    }
  },
  watch: {
    login() {
      this.clearError()
    }
  },
  computed: {
    showServerError() {
      return this.serverError && !this.$v.$anyDirty
    }
  },
  methods: {
    ...mapActions(['AUTH_REQUEST']),
    login() {
      this.clearError()
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }
      this.sending = true

      this.AUTH_REQUEST({
        username: this.username,
        password: this.password
      })
        .then(() => {
          this.$emit('form:sent')
        })
        .catch(error => {
          if (error.status === 401) {
            this.serverError = 'Неверная пара логин - пароль'
          } else if (error.status === 403) {
            this.serverError = 'Доступ пользователю заблокирован. Обратитесь к администратору'
          } else if (error.data.message) {
            this.serverError = error.data.message.join('; ')
          }
        })
        .finally(() => {
          this.clearFields()
          this.sending = false
        })
    },
    clearFields() {
      this.password = null
      this.$v.$reset()
    },
    clearError() {
      this.serverError = null
    }
  }
}
</script>
