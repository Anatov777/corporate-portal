<template>
  <form @submit.prevent="submitForm" class="modal-form">
    <base-form-group
      :label-text="labelText"
      :input-value.sync="attachedFiles"
      inputType="files"
      :is-multiple-files="true"
      :file-type="fileType"
      :is-form-invalid.sync="isInvalidForm"
      @update-image="setUpdatedFile($event)"
      @delete-image="setDeletedFile($event)"
    />

    <div class="d-flex justify-content-end align-items-center mt-40">
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

export default {
  name: 'FilesEditForm',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    Loader: () => import('@/components/Elements/Loader'),
    BaseFormGroup: () => import('@/components/Elements/BaseFormGroup')
  },
  props: {
    mode: {
      type: String,
      required: false,
      default: 'add'
    },
    files: {
      type: Array
    },
    fileType: {
      type: String,
      required: false,
      default: 'image'
    }
  },
  data: () => ({
    isUpdating: false,
    attachedFiles: null,
    attachedFilesInitial: [],
    imagesToDelete: [],
    imagesToUpdate: [],
    isInvalidForm: true
  }),
  async created() {
    this.attachedFilesInitial = Array.from(this.files)
    this.attachedFiles = [...this.files]
  },
  computed: {
    isButtonDisabled() {
      return this.isInvalidForm || this.isUpdating
    },
    newsId() {
      return this.$route.params.id
    },
    labelText() {
      if (this.fileType === 'image') return 'Прикрепить картинку'
      return 'Прикрепить файл'
    },
    fileTypeNumber() {
      if (this.fileType === 'document') return 0
      return 2
    }
  },
  methods: {
    async submitForm() {
      this.isUpdating = true
      if (this.mode === 'edit') {
        if (this.imagesToDelete.length) {
          for (const item of this.imagesToDelete) {
            await this.deleteFile(item)
          }
        }
        if (this.imagesToUpdate.length) {
          for (const item of this.imagesToUpdate) {
            await this.updateFilesInfo(item)
          }
        }
        if (!this.attachedFiles.length) {
          await this.addFiles()
        }
      } else await this.addFiles()
    },
    async addFiles() {
      this.attachedFiles.append('type', this.fileTypeNumber)

      await http
        .post(`/posts/${this.newsId}/media`, this.attachedFiles)
        .then(response => {
          Object.keys(response.data.data).forEach(id => {
            let filePath = this.fileTypeNumber ? response.data.data[id]?.orig : response.data.data[id]
            this.attachedFilesInitial.push({
              path: filePath,
              title: this.attachedFiles.get(`title[${this.attachedFilesInitial.length}]`),
              id: id
            })
          })
          this.updateFiles()
        })
        .finally(() => {
          this.isUpdating = false
        })
    },
    setDeletedFile(element) {
      this.imagesToDelete.push(element.id)
    },
    setUpdatedFile(element) {
      this.imagesToUpdate.push(element)
    },
    async updateFilesInfo(image) {
      await http
        .patch(`/posts/${this.newsId}/media`, {
          id: image.id,
          title: image.title
        })
        .then(response => {
          let imageToUpdate = this.attachedFilesInitial.find(item => item.id === image.id)
          let imageIndex = this.attachedFilesInitial.indexOf(imageToUpdate)
          this.attachedFilesInitial.splice(imageIndex, 1, response.data.data)
          this.updateFiles()
        })
        .finally(() => {
          this.isUpdating = false
        })
    },
    async deleteFile(mediaId) {
      await http
        .delete(`/posts/${this.newsId}/media`, {
          data: {
            id: mediaId
          }
        })
        .then(() => {
          let imageIndex = this.attachedFilesInitial.findIndex(item => item.id === mediaId)
          this.attachedFilesInitial.splice(imageIndex, 1)
          this.updateFiles()
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdating = false
        })
    },
    updateFiles() {
      this.$emit('update:files', this.attachedFilesInitial)
      this.$emit('close-modal')
    }
  }
}
</script>
