<template>
  <form @submit.prevent="submitForm" class="modal-form">
    <div class="mb-50">
      <div v-if="!isAnnounce" class="modal-form-select-group">
        <base-select
          label-text="Тип"
          option-key="title"
          :select-options="newsTypes"
          :selected-value.sync="newsTypesSelected"
          placeholder-text="Выберите тип"
          :is-news-types="true"
          :is-column-direction="true"
          :is-form-invalid.sync="isInvalidNewsTypeField"
          class="modal-form-select-group-triple"
        />
        <base-select
          v-if="isEvent"
          label-text="Вид события"
          option-key="title"
          :select-options="eventTypes"
          :selected-value.sync="eventTypesSelected"
          placeholder-text="Выберите вид"
          :is-column-direction="true"
          :is-form-invalid.sync="isInvalidNewsEventTypeField"
          class="modal-form-select-group-triple"
        />
      </div>
    </div>
    <multiple-select
      v-if="isEvent"
      label-text="Кого поздравляем"
      option-key="full_name"
      :select-options="employees"
      :selected-value.sync="employeeSelected"
      placeholder-text="Выберите сотрудника"
      :is-form-invalid.sync="isInvalidNewsEmployeeField"
    />
    <base-form-group
      label-text="Топовая новость"
      inputType="checkbox"
      :input-value.sync="isTopNews"
      form-validation-config-value="not required"
      class="modal-form-checkbox mt-10"
    />
    <base-form-group
      label-text="Заголовок"
      :input-value.sync="newsTitle"
      :is-form-invalid.sync="isInvalidNewsTitleField"
    />
    <base-form-group
      label-text="Заголовок предпросмотра"
      :input-value.sync="titlePreview"
      form-validation-config-value="not required"
    />
    <base-form-group
      label-text="Сообщение"
      :input-value.sync="message"
      :is-form-invalid.sync="isInvalidMessageField"
      :form-validation-config-value="isRequiredMessageField"
      inputType="text-editor"
    />
    <base-form-group
      label-text="Прикрепить картинку"
      :input-value.sync="attachedImage"
      inputType="files"
      form-validation-config-value="not required"
      @delete-image="setDeletedImage($event)"
    />
    <base-form-group
      v-if="addFilesFieldIsVisible"
      label-text="Прикрепить файлы"
      :input-value.sync="attachedFiles"
      inputType="files"
      :is-multiple-files="true"
      file-type="document"
      form-validation-config-value="not required"
    />

    <div class="d-flex justify-content-end align-items-center mt-40">
      <transition v-if="isNotEmptyForm" name="fade">
        <span class="mr-30 reset-form-button" @click="resetForm">Очистить</span>
      </transition>
      <base-button size="lg" type="submit" rounded="pill" fill="primary" :disabled="isButtonDisabled">
        <span v-if="mode === 'add'">Добавить</span>
        <span v-else>Сохранить</span>
        <loader v-if="isUpdating" class="ml-2" size="sm" color="white" />
      </base-button>
    </div>
  </form>
</template>

<script>
import formsActionsMixin from '@/mixins/formsActions.mixin'
import http from '@/modules/http'
import '@/styles/elements/transitions/_fade.scss'
import '@/styles/elements/_reset-form-btn.scss'
import '@/styles/modules/modal-form.scss'
import postTypes from '@/config/postTypes'
import { mapGetters } from 'vuex'
import newsFilter from '@/filters/news.filter'

export default {
  name: 'NewsEditForm',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    Loader: () => import('@/components/Elements/Loader'),
    BaseFormGroup: () => import('@/components/Elements/BaseFormGroup'),
    BaseSelect: () => import('@/components/Elements/BaseSelect'),
    MultipleSelect: () => import('@/components/Elements/MultipleSelect')
  },
  mixins: [formsActionsMixin],
  props: {
    news: {
      type: [Object, Array]
    },
    mode: {
      type: String,
      default: 'add'
    },
    newsTypes: {
      type: Array,
      default: null
    },
    eventTypes: {
      type: Array,
      default: null
    },
    employees: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    isUpdating: false,
    entityId: null,
    newsResponse: {},
    deletedImage: [],
    // Fields
    newsTypesSelected: null,
    eventTypesSelected: null,
    employeeSelected: null,
    newsTitle: '',
    titlePreview: '',
    message: '',
    attachedImage: null,
    attachedFiles: null,
    isTopNews: false,
    // Validation data
    isInvalidNewsTypeField: true,
    isInvalidNewsEventTypeField: true,
    isInvalidNewsEmployeeField: true,
    isInvalidNewsTitleField: true,
    isInvalidMessageField: true
  }),
  async created() {
    if (this.mode === 'edit') {
      this.setFieldsValue()
    }
    if (!this.newsTypes?.length) {
      await this.fetchNewsTypes()
      if (this.mode !== 'add') {
        this.setNewsTypes()
      } else {
        this.newsTypesSelected = { id: 1, title: 'Новости' }
      }
    }
  },
  watch: {
    newsTypesSelected() {
      if (this.newsTypesSelected) {
        if (this.isEvent && !this.eventTypes.length) {
          this.fetchEventTypes()
          !this.employees.length ? this.fetchEmployees() : ''
          this.attachedFiles = null
        } else if (!this.isEvent) {
          this.eventTypesSelected = null
          this.employeeSelected = null
        }
      }
    }
  },
  computed: {
    ...mapGetters(['AUTH_USER']),
    newsAuthorId() {
      return this.AUTH_USER.id
    },
    isRequiredMessageField() {
      if (this.isEvent || this.isAnnounce) return 'not required'
      return null
    },
    isInvalidForm() {
      if (this.isEvent)
        return (
          this.isInvalidNewsTypeField ||
          this.isInvalidNewsEventTypeField ||
          this.isInvalidNewsEmployeeField ||
          this.isInvalidNewsTitleField
        )
      if (this.isAnnounce) return this.isInvalidNewsTitleField
      return this.isInvalidNewsTypeField || this.isInvalidNewsTitleField || this.isInvalidMessageField
    },
    isNotEmptyForm() {
      return (
        this.newsTypesSelected ||
        this.eventTypesSelected ||
        this.employeeSelected ||
        this.newsTitle ||
        this.titlePreview ||
        this.message ||
        this.attachedImage
      )
    },
    isEvent() {
      if (this.newsTypesSelected) return this.newsTypesSelected.id === postTypes.TYPE_EVENT
      return 0
    },
    isAnnounce() {
      if (this.newsTypes?.length === 1) {
        if (this.newsTypes[0].id === 3) return true
      }
      return false
    },
    isButtonDisabled() {
      return this.isInvalidForm || this.isUpdating
    },
    addFilesFieldIsVisible() {
      return this.mode === 'add' && !this.isEvent && !this.isAnnounce
    }
  },
  methods: {
    setFieldsValue() {
      this.newsTypesSelected = this.news.category
      this.eventTypesSelected = this.news.event_type
      if (this.news.employees) {
        this.setFullName(this.news.employees)
        this.employeeSelected = [...this.news.employees]
      }
      this.newsTitle = this.news.title
      this.titlePreview = this.news.title_preview
      this.message = this.news.text
      this.attachedImage = this.news.image
      this.isTopNews = this.news.top
    },
    setNewsTypes() {
      if (this.news.category.id !== 5) {
        this.$emit(
          'update:news-types',
          this.newsTypes.filter(type => type.id !== 5)
        )
      }
    },
    async fetchNewsTypes() {
      await http
        .get('/posts/category')
        .then(response => {
          this.$emit('update:news-types', response.data.data)
        })
        .catch(error => console.error(error))
    },
    async fetchEventTypes() {
      await http
        .get('/posts/event-type')
        .then(response => {
          this.$emit('update:event-types', response.data.data)
        })
        .catch(error => console.error(error))
    },
    async fetchEmployees() {
      await http
        .get('/employees', { params: { 'o-field': `surname` } })
        .then(response => {
          this.setFullName(response.data.data)
          this.$emit('update:employees', response.data.data)
        })
        .catch(error => console.error(error))
    },
    setFullName(employeesArray) {
      employeesArray.map(employee => {
        employee.full_name = `${employee.surname} ${employee.name} ${employee.patronymic}`
      })
    },
    async submitForm() {
      this.isUpdating = true
      if (this.mode === 'edit') {
        await this.editNews()
      } else await this.addNews()
    },
    getFormData() {
      const formData = {
        category: this.newsTypesSelected,
        event_type: this.eventTypesSelected,
        title: this.newsTitle,
        title_preview: this.titlePreview,
        text: this.message || '<p></p>',
        status: '1',
        is_informed: true,
        top: this.isTopNews,
        date: this.moment().format('DD.MM.YYYY')
      }
      if (this.mode === 'add') {
        formData.author = this.newsAuthorId
        formData.employees = this.employeeSelected
        this.isAnnounce ? (formData.category = { id: 3, title: 'Объявление' }) : ''
      } else {
        formData.date = this.news.date
        formData.employees = this.employeeSelected
      }
      return formData
    },
    async editNews() {
      const formData = this.getFormData()
      await http
        .patch(`/posts/${this.$route.params.id}`, formData)
        .then(response => {
          this.newsResponse = response.data.data
          this.entityId = response.data.data.id
        })
        .catch(error => console.error(error))
      if (this.entityId && this.news.image !== this.attachedImage) {
        await this.addNewsImage()
      }
      this.$emit('update:news', this.newsResponse)
      this.isUpdating = false
      this.$emit('close-modal')
    },
    async addNews() {
      const formData = this.getFormData()
      const responsePost = (await http.post(`/posts`, formData)).data
      this.entityId = responsePost.data.id
      this.newsResponse = newsFilter(responsePost.data)
      if (this.entityId && this.attachedFiles) {
        await this.addNewsFiles()
      }
      if (this.entityId && this.attachedImage) {
        await this.addNewsImage()
      }
      this.news.unshift(this.newsResponse)
      this.isUpdating = false
      this.$emit('close-modal')
    },
    async addNewsImage() {
      this.attachedImage.append('type', 1)

      await http.post(`/posts/${this.entityId}/media`, this.attachedImage).then(response => {
        let responseDataKeys = Object.keys(response.data.data)
        this.newsResponse.image = response.data.data[responseDataKeys[0]]
      })
    },
    async addNewsFiles() {
      this.attachedFiles.append('type', 0)
      await http.post(`/posts/${this.entityId}/media`, this.attachedFiles)
    },
    // async deleteNewsImage() {
    //   await http
    //     .delete(`/posts/${this.entityId}/media`, {
    //       data: {
    //         id: this.entityId // Должно быть id media, а не новости
    //       }
    //     })
    //     .then(response => {
    //       console.log(response)
    //     })
    // },
    setDeletedImage(event) {
      this.deletedImage.push(event)
    },
    resetForm() {
      this.newsTypesSelected = ''
      this.eventTypesSelected = ''
      this.employeeSelected = ''
      this.newsTitle = ''
      this.titlePreview = ''
      this.message = ''
      this.attachedImage = null
    }
  }
}
</script>
