<template>
  <form @submit.prevent="submitForm" class="modal-form avatar-edit-form">
    <img v-if="imageData.path" class="avatar-edit-form-photo" :src="imageData.path" :alt="imageData.title" />
    <div v-else class="mb-20">Нет фото</div>
    <base-button size="sm" rounded="pill" outline="primary" @click-btn="selectFile">
      <span v-if="imageData.path">Заменить фото</span>
      <span v-else>Загрузить фото</span>
    </base-button>
    <input ref="fileInput" type="file" accept="image/*" @change="handleFiles($event)" />

    <div class="d-flex justify-content-end align-items-center mt-40">
      <base-button size="lg" type="submit" rounded="pill" fill="primary" :disabled="isButtonDisabled">
        <span>Сохранить</span>
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
    Loader: () => import('@/components/Elements/Loader')
  },
  props: {
    imagePath: {
      type: String
    }
  },
  data: () => ({
    isUpdating: false,
    formData: new FormData(),
    imageData: {}
  }),
  async created() {
    this.imageData.path = this.imagePath
  },
  computed: {
    isButtonDisabled() {
      return this.isUpdating || !this.imageData.title
    },
    employeeId() {
      return this.$route.params.id
    }
  },
  methods: {
    async submitForm() {
      await this.changePhoto()
    },
    selectFile() {
      this.$refs.fileInput.click()
    },
    handleFiles(inputEvent) {
      const file = inputEvent.target.files[0]
      let reader = new FileReader()
      reader.onload = event => {
        const src = event.target.result
        this.formData.set(`file[0]`, file)
        this.formData.set(`title[0]`, file.name)
        this.imageData = {
          title: file.name,
          path: src
        }
        this.$emit('change:files', this.formData)
      }
      reader.readAsDataURL(file)
    },
    async changePhoto() {
      this.isUpdating = true
      this.formData.append('type', 1)
      await http
        .post(`/employees/${this.employeeId}/media`, this.formData)
        .then(response => {
          this.$emit('update:image', response.data.data[this.employeeId].preview)
          this.$emit('close-modal')
        })
        .finally(() => {
          this.isUpdating = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar-edit-form {
  input[type='file'] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .avatar-edit-form-photo {
    margin-bottom: 20px;
    max-height: 200px;
    max-width: 200px;
  }
}
</style>
