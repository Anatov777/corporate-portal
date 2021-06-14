<template>
  <form @submit.prevent="submitForm" class="modal-form">
    <base-form-group
      label-text="Псевдоним URL"
      :input-value.sync="alias"
      :is-form-invalid.sync="isInvalidAliasField"
      :is-disable-input="mode === 'edit'"
      form-validation-config-value="alias"
    />
    <base-form-group
      label-text="Заголовок"
      :input-value.sync="title"
      :is-form-invalid.sync="isInvalidTitleField"
    />

    <small v-if="isError" class="text-danger">{{ errorMessage }}</small>
    <div
      class="d-flex align-items-center mt-40"
      :class="{ 'justify-content-between': mode === 'edit', 'justify-content-end': mode === 'add' }"
    >
      <delete-button v-if="mode === 'edit'" :loaderIsActive="isDeleting" @confirm="deleteInfoTab">
        <template slot="header">
          Удаление раздела
        </template>
        <template slot="body">
          Удалить раздел?
        </template>
      </delete-button>
      <base-button size="lg" type="submit" rounded="pill" fill="primary" :disabled="isButtonDisabled">
        <span v-if="mode === 'add'">Добавить</span>
        <span v-else>Сохранить</span>
        <loader v-if="isUpdating" class="ml-2" size="sm" color="white" />
      </base-button>
    </div>
  </form>
</template>

<script>
import http from '@/modules/http'
import { mapGetters, mapActions } from 'vuex'
import '@/styles/modules/modal-form.scss'
import formsActionsMixin from '@/mixins/formsActions.mixin'

export default {
  name: 'InfoTabEditForm',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    DeleteButton: () => import('@/components/Elements/DeleteButton'),
    Loader: () => import('@/components/Elements/Loader'),
    BaseFormGroup: () => import('@/components/Elements/BaseFormGroup')
  },
  mixins: [formsActionsMixin],
  props: {
    mode: {
      type: String,
      default: 'edit'
    },
    infoData: {
      type: Object
    },
    activeTabInfo: {
      type: Object
    }
  },
  data: () => ({
    isUpdating: false,
    isDeleting: false,
    alias: '',
    title: '',
    isInvalidAliasField: true,
    isInvalidTitleField: true,
    errorMessage: null
  }),
  async created() {
    if (this.mode === 'edit') this.setFieldsValue()
  },
  computed: {
    ...mapGetters(['GET_TABS_DATA']),
    isInvalidForm() {
      return this.isInvalidAliasField || this.isInvalidTitleField
    },
    isButtonDisabled() {
      return this.isInvalidForm || this.isUpdating
    },
    isError() {
      if (this.errorMessage) return true
      return false
    }
  },
  methods: {
    ...mapActions(['SET_TABS_DATA']),
    setFieldsValue() {
      this.alias = this.activeTabInfo.alias
      this.title = this.activeTabInfo.title
    },
    aliasFieldIsParentAlias() {
      return this.$route.params.pageAlias === this.alias
    },
    aliasFieldIsNumeric() {
      return !isNaN(+this.alias)
    },
    async submitForm() {
      if (this.mode === 'add') {
        if (this.aliasFieldIsParentAlias()) this.errorMessage = `Запрещенное имя раздела - ${this.alias}`
        else if (this.aliasFieldIsNumeric())
          this.errorMessage = `Поле 'alias' не может состоять только из цифр`
        else await this.addInfoTab()
      }
      if (this.mode === 'edit') await this.editInfoTab()
    },
    getFormData() {
      return {
        alias: this.alias,
        parent: this.infoData.alias,
        title: this.title,
        order: 1
      }
    },
    async addInfoTab() {
      this.isUpdating = true
      const formData = this.getFormData()
      await http
        .post(`/info`, formData)
        .then(response => {
          const responseTab = response.data.data
          this.updateTabData(responseTab, 'add')
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.errorMessage = 'Псевдоним URL с таким названием уже существует'
          }
        })
      this.isUpdating = false
    },
    async editInfoTab() {
      this.isUpdating = true
      const formData = this.getFormData()
      const responseTab = (await http.patch(`/info/${this.alias}`, formData))?.data?.data
      this.updateTabData(responseTab, 'edit')
    },
    async deleteInfoTab() {
      this.isDeleting = true
      await http
        .delete(`/info/${this.activeTabInfo.id}`)
        .then(() => {
          this.$emit('delete:tab', this.activeTabInfo.id)
          this.$emit('close-modal')
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.errorMessage = 'Нельзя удалить раздел с блоками'
          }
        })
        .finally((this.isDeleting = false))
    },
    updateTabData(data, mode) {
      const tabData = {
        alias: data.alias,
        id: data.id,
        title: data.title,
        value: data.alias
      }
      if (mode === 'add') this.$emit('update:infoData', tabData)
      if (mode === 'edit') this.$emit('update:infoData', { tabData: tabData, mode: 'edit' })
      this.isUpdating = false
      this.$emit('close-modal')
    }
  }
}
</script>
