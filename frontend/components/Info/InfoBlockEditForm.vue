<template>
  <form @submit.prevent="submitForm" class="modal-form">
    <base-form-group
      label-text="Заголовок блока"
      :input-value.sync="title"
      :is-form-invalid.sync="isInvalidTitleField"
    />
    <base-form-group
      label-text="Текст блока"
      :input-value.sync="text"
      :is-form-invalid.sync="isInvalidTextField"
      inputType="text-editor"
    />
    <base-form-group label-text="Метка" :input-value.sync="tag" form-validation-config-value="not required" />
    <base-form-group
      label-text="Прикрепить файлы"
      :input-value.sync="attachedFiles"
      inputType="files"
      file-type="document"
      form-validation-config-value="not required"
      @update-image="setUpdatedFile($event)"
      @delete-image="setDeletedFile($event)"
    />
    <base-form-group
      label-text="Прикрепить картинку"
      :input-value.sync="attachedImage"
      inputType="files"
      form-validation-config-value="not required"
    />
    <div
      class="d-flex align-items-center mt-40"
      :class="{ 'justify-content-between': mode === 'edit', 'justify-content-end': mode === 'add' }"
    >
      <delete-button v-if="mode === 'edit'" :loaderIsActive="isDeleting" @confirm="deleteBlock">
        <template slot="header">
          Удаление блока
        </template>
        <template slot="body">
          Удалить блок?
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
import '@/styles/modules/modal-form.scss'
import { mapGetters, mapActions } from 'vuex'
import formsActionsMixin from '@/mixins/formsActions.mixin'

export default {
  name: 'InfoBlockEditForm',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    Loader: () => import('@/components/Elements/Loader'),
    BaseFormGroup: () => import('@/components/Elements/BaseFormGroup'),
    DeleteButton: () => import('@/components/Elements/DeleteButton')
  },
  mixins: [formsActionsMixin],
  props: {
    mode: {
      type: String,
      default: 'edit'
    },
    activeBlockData: {
      type: Object
    },
    blockFiles: {
      type: Array
    }
  },
  data: () => ({
    isUpdating: false,
    isDeleting: false,
    title: '',
    text: '',
    tag: '',
    attachedImage: null,
    attachedFiles: null,
    filesToDelete: [],
    filesToUpdate: [],
    isInvalidTitleField: true,
    isInvalidTextField: true
  }),
  async created() {
    if (this.mode === 'edit') this.setFieldsValue()
  },
  computed: {
    ...mapGetters(['GET_BLOCKS_DATA', 'GET_TABS_DATA']),
    isInvalidForm() {
      return this.isInvalidTitleField || this.isInvalidTextField
    },
    isButtonDisabled() {
      return this.isInvalidForm || this.isUpdating
    }
  },
  methods: {
    ...mapActions(['SET_BLOCKS_DATA', 'SET_BLOCK_ITEM_DATA']),
    setFieldsValue() {
      this.title = this.activeBlockData.title
      this.text = this.activeBlockData.text
      this.tag = this.activeBlockData.tag
      this.attachedImage = this.activeBlockData.image
      this.attachedFiles = [...this.blockFiles]
    },
    async submitForm() {
      this.isUpdating = true
      if (this.mode === 'add') {
        await this.addInfoBlock()
      }
      if (this.mode === 'edit') {
        if (this.filesToDelete.length) {
          for (const item of this.filesToDelete) {
            await this.deleteFile(item)
          }
        }
        if (this.filesToUpdate.length) {
          for (const item of this.filesToUpdate) {
            await this.updateFilesInfo(item)
          }
        }
        await this.editInfoBlock()
      }
      this.isUpdating = false
    },
    getFormData() {
      const formData = {
        title: this.title,
        text: this.text,
        tag: this.tag,
        order: 1
      }
      if (this.mode === 'edit') {
        formData.id = this.activeBlockData.id
        formData.owner = this.activeBlockData.owner
      }
      if (this.mode === 'add') formData.owner = `${this.$route.params.tabAlias}`
      return formData
    },
    async addInfoBlock() {
      const formData = this.getFormData()
      const responseBlock = (await http.post(`/info/blocks`, formData))?.data?.data
      this.entityId = responseBlock.id
      if (this.entityId && this.attachedFiles) await this.addFiles()
      if (this.entityId && this.attachedImage) await this.addImage(responseBlock)
      this.SET_BLOCKS_DATA(responseBlock)
      this.$emit('close-modal')
    },
    async editInfoBlock() {
      const formData = this.getFormData()
      const responseBlock = await http.patch(`/info/blocks/${this.activeBlockData.id}`, formData)
      this.entityId = responseBlock?.data?.data?.id

      if (this.entityId && typeof this.attachedFiles.length === 'undefined') await this.addFiles()
      if (this.entityId && this.activeBlockData.image !== this.attachedImage && this.attachedImage)
        await this.addImage(responseBlock?.data?.data)
      this.SET_BLOCK_ITEM_DATA(responseBlock.data.data)
      this.$emit('close-modal')
    },
    async addImage(blockData) {
      this.attachedImage.append('type', 1)
      await http.post(`/info/blocks/${this.entityId}/media`, this.attachedImage).then(response => {
        let responseDataKeys = Object.keys(response.data.data)
        blockData.image = response.data.data[responseDataKeys[0]]
        this.$emit('update:image', response.data.data[responseDataKeys[0]])
      })
    },
    async addFiles() {
      this.attachedFiles.append('type', 0)
      await http.post(`/info/blocks/${this.entityId}/media`, this.attachedFiles).then(response => {
        let files = [...this.blockFiles]
        let responseDataKeys = Object.keys(response.data.data)
        responseDataKeys.forEach(key => {
          files.push({
            id: key,
            path: response.data.data[key],
            title: this.attachedFiles.get('title[0]')
          })
        })
        this.$emit('update:file', files)
      })
    },
    setDeletedFile(element) {
      this.filesToDelete.push(element.id)
    },
    async deleteFile(mediaId) {
      await http
        .delete(`/info/blocks/${this.activeBlockData.id}/media`, {
          data: {
            id: mediaId
          }
        })
        .then(() => {
          let files = [...this.blockFiles]
          let fileIndex = files.findIndex(item => item.id === mediaId)
          files.splice(fileIndex, 1)
          this.$emit('delete:file')
        })
    },
    setUpdatedFile(element) {
      this.filesToUpdate.push(element)
    },
    async updateFilesInfo(file) {
      await http
        .patch(`/info/blocks/${this.filesToUpdate[0].owner}/media`, {
          id: file.id,
          title: file.title
        })
        .then(response => {
          this.$emit('update:blockFiles', [response.data.data])
          this.$emit('close-modal')
        })
    },
    async deleteBlock() {
      this.isDeleting = true
      await http.delete(`/info/blocks/${this.activeBlockData.id}`).then(() => {
        this.$emit('delete:block', this.activeBlockData.id)
        this.$emit('close-modal')
      })
      this.isDeleting = false
    }
  }
}
</script>
