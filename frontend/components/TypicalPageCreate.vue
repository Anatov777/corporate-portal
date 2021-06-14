<template>
  <div>
    <form class="add-typical-page d-inline-block overflow-auto" @submit.prevent="savePage">
      <div class="d-flex justify-content-between">
        <h3 v-if="!insertedAlias">Добавление страницы</h3>
        <h3 v-else>Редактирование страницы</h3>
        <span class="close-icon" role="button" @click="openAddForm"></span>
      </div>
      <div class="form-group login-form-group d-flex align-items-center justify-content-between mt-30">
        <label class="login-label col-sm-3">alias</label>
        <input
          type="text"
          name="page-alias"
          class="form-control col-sm-9 login-input"
          :class="{ 'is-invalid': $v.pageAlias.$error }"
          v-model="$v.pageAlias.$model"
          v-focus
          :readonly="!!insertedAlias"
        />
      </div>
      <div
        class="text-danger pb-2 row justify-content-end"
        v-show="!$v.pageAlias.required && $v.pageAlias.$error"
      >
        <small class="col-9">Поле "alias" обязательно для заполнения.</small>
      </div>
      <div
        class="text-danger pb-2 row justify-content-end"
        v-show="!$v.pageAlias.maxLength && $v.pageAlias.$error"
      >
        <small class="col-9">Поле "alias" должно содержать не более 156 символов.</small>
      </div>
      <div
        class="text-danger pb-2 row justify-content-end"
        v-show="!$v.pageAlias.uniq && $v.pageAlias.$error"
      >
        <small class="col-9">Такой псевдоним уже существует.</small>
      </div>
      <div
        class="text-danger pb-2 row justify-content-end"
        v-show="!$v.pageAlias.aliasRegex && $v.pageAlias.$error"
      >
        <small class="col-9">Поле "alias" должно содержать только буквы, цифры и тире.</small>
      </div>
      <div class="form-group login-form-group d-flex align-items-center justify-content-between">
        <label class="login-label col-sm-3">title</label>
        <input
          type="text"
          name="page-title"
          class="form-control col-sm-9 login-input"
          :class="{ 'is-invalid': $v.pageTitle.$error }"
          v-model="$v.pageTitle.$model"
        />
      </div>
      <div
        class="text-danger pb-2 row justify-content-end"
        v-show="!$v.pageTitle.required && $v.pageTitle.$error"
      >
        <small class="col-9">Поле "title" обязательно для заполнения.</small>
      </div>
      <div class="form-group login-form-group d-flex align-items-start">
        <label class="login-label col-sm-3">text</label>
        <vue-trix v-model="$v.pageText.$model" class="form-control col-sm-9 login-input"></vue-trix>
      </div>
      <div
        class="text-danger pb-2 row justify-content-end"
        v-show="!$v.pageText.required && $v.pageText.$error"
      >
        <small class="col-9">Поле "text" обязательно для заполнения.</small>
      </div>
      <div class="d-flex justify-content-end align-items-center mt-5">
        <span v-if="dataSaved" class="mr-20 text-success">Сохранено!</span>
        <span v-if="serverError" class="mr-20 text-danger">Ошибка!</span>
        <base-button size="lg" rounded="pill" fill="primary" :disabled="$v.$invalid" type="submit">
          Сохранить
          <span v-if="sending" class="spinner-border spinner-border-sm text-white ml-2"></span>
        </base-button>
      </div>
    </form>
    <div class="blackout"></div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import '@/styles/modules/typical-page-create.scss'
import '@/styles/modules/login.scss'
import http from '@/modules/http'
import { aliasRegex } from '@/validators/validators'
import finallyActionMixin from '@/mixins/formsActions.mixin'

export default {
  name: 'TypicalPageCreate',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    VueTrix: () => import('vue-trix')
  },
  props: {
    insertedAlias: {
      type: String
    },
    insertedTitle: {
      type: String
    },
    insertedText: {
      type: String
    }
  },
  mixins: [finallyActionMixin],
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  data: () => ({
    pageAlias: null,
    pageTitle: null,
    pageText: null,
    exsistedAliases: [],
    uniqAlias: true,
    dataSaved: false,
    sending: false,
    serverError: false
  }),
  async created() {
    this.pageAlias = this.insertedAlias
    this.pageTitle = this.insertedTitle
    this.pageText = this.insertedText
    this.exsistedAliases = await this.getAliases()
  },
  computed: {
    formData() {
      return {
        type: null,
        alias: this.pageAlias,
        title: this.pageTitle,
        text: this.pageText,
        date: this.moment().format('DD.MM.YYYY')
      }
    }
  },
  validations() {
    return {
      pageAlias: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(156),
        aliasRegex,
        uniq: this.aliasValidator
      },
      pageTitle: {
        required
      },
      pageText: {
        required
      }
    }
  },
  methods: {
    openAddForm() {
      this.$emit('open-add-form')
    },
    savePage() {
      this.$v.$touch()
      this.submitForm()
    },
    async submitForm() {
      this.sending = true
      if (this.insertedAlias) {
        this.editPage()
      } else {
        this.createPage()
      }
    },
    editPage() {
      http
        .patch(`/pages/${this.pageAlias}`, this.formData)
        .then(res => {
          this.showMessage()
          this.$emit('update:insertedTitle', this.pageTitle)
          this.$emit('update:insertedText', this.pageText)
        })
        .catch(err => console.error(err))
        .finally(() => {
          this.onFinallyAction()
        })
    },
    createPage() {
      http
        .post('/pages', this.formData)
        .then(res => {
          this.showMessage()
          this.serverError = false
        })
        .catch(err => {
          console.error(err)
          this.serverError = true
        })
        .finally(() => {
          this.onFinallyAction()
        })
    },
    async getAliases() {
      const aliases = []
      const pages = (await http.get('/pages')).data.data
      pages.forEach(element => {
        aliases.push(element.alias)
      })
      return aliases
    },
    aliasValidator(value) {
      return !(this.exsistedAliases.includes(value) && !this.insertedAlias)
    },
    showMessage() {
      this.dataSaved = true
      setTimeout(() => (this.dataSaved = false), 600)
    }
  }
}
</script>
