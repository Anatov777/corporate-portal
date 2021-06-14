<template>
  <div class="file-loader">
    <div v-if="hasFiles" class="file-loader__attachments">
      <div v-for="(file, index) in localFiles" :key="file.id" class="file-loader__attachments-content">
        <div class="file-loader__attachments-image">
          <span class="close-icon" @click="removeImage(index)"></span>
          <img v-if="imageIsVisible(file.path)" :src="file.path" :alt="file.title" />
          <div v-else-if="isImage">{{ file.title }}</div>
          <div v-else-if="isDocument" class="file-loader-filename scroll-primary">
            <svg-icon :name="file.iconName" title="Файл" />
          </div>
        </div>
        <base-textarea
          :value="file.title"
          :class-name="`modal-form-input file-loader-textarea`"
          max-height="34"
          placeholder="Название"
          @input="file.title = $event"
          @change="handleFileTitle(index)"
        />
      </div>
      <label
        v-if="isVisibleAddFilesButton"
        :for="`${inputId}-${fileCounter}`"
        :class="addFileButtonClassName"
      ></label>
    </div>
    <input
      v-for="(item, index) in fileCounter + 1"
      :key="index"
      ref="formFiles"
      :id="`${inputId}-${index}`"
      type="file"
      :accept="acceptMimeType"
      @change="handleFiles($event)"
    />
  </div>
</template>

<script>
import '@/styles/modules/files-loader.scss'
import '@/styles/elements/_close-icon.scss'
import '@/styles/modules/modal-form.scss'
import '@/styles/elements/_scroll.scss'
import '@/styles/elements/_base-textarea.scss'

export default {
  name: 'FilesLoader',
  components: {
    SvgIcon: () => import('@/components/Elements/SvgIcon'),
    BaseTextarea: () => import('@/components/Elements/BaseTextarea')
  },
  props: {
    files: {
      required: false
    },
    fileType: {
      type: String,
      default: 'image'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    deletedImages: {
      type: Array,
      required: false
    }
  },
  data: () => ({
    formData: new FormData(),
    localFiles: [],
    fileCounter: 0
  }),
  created() {
    if (typeof this.files === 'string') this.localFiles.push({ path: this.files })
    else if (this.files?.length) {
      this.files.forEach(element => {
        this.localFiles.push({
          id: element.id,
          title: element.title,
          path: element.path,
          name: this.getFilePathLastWord(element.path, '/'),
          owner: element.owner
        })
        let lastFile = this.localFiles[this.localFiles.length - 1]
        let fileExtension = this.getFilePathLastWord(lastFile.name, '.')
        lastFile.iconName = this.getFileIconName(fileExtension)
      })
    }
  },
  watch: {
    files() {
      if (!this.files) {
        this.localFiles = []
      }
    }
  },
  computed: {
    hasFiles() {
      return this.localFiles
    },
    acceptMimeType() {
      if (this.fileType === 'document')
        return '.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.txt,.dot,.ott,.rtf,.wmf'
      return 'image/*'
    },
    inputId() {
      return `files-${this.fileType}`
    },
    isVisibleAddFilesButton() {
      return !this.localFiles.length || this.isMultiple
    },
    addFileButtonClassName() {
      return 'file-loader-button'
    },
    isImage() {
      return this.fileType === 'image'
    },
    isDocument() {
      return this.fileType === 'document'
    }
  },
  methods: {
    imageIsVisible(filePath) {
      return filePath && this.fileType === 'image'
    },
    getFilePathLastWord(filePath, separationSymbol) {
      let fileNameToArray = filePath.split(separationSymbol)
      return fileNameToArray[fileNameToArray.length - 1]
    },
    getFileIconName(extension) {
      if (['doc', 'docx'].includes(extension)) return 'file-word'
      if (['xls', 'xlsx'].includes(extension)) return 'file-excel'
      if (['ppt', 'pptx'].includes(extension)) return 'file-powerpoint'
      if (['pdf'].includes(extension)) return 'file-pdf'
      return 'file'
    },
    handleFiles(inputEvent) {
      const file = inputEvent.target.files[0]
      let reader = new FileReader()
      reader.onload = event => {
        const src = event.target.result
        this.formData.set(`file[${this.localFiles.length}]`, file)
        this.formData.set(`title[${this.localFiles.length}]`, file.name)
        this.localFiles.push({
          title: file.name,
          path: src
        })

        if (this.fileType === 'document') {
          this.localFiles[this.localFiles.length - 1].name = file.name
          let fileExtension = this.getFilePathLastWord(file.name, '.')
          this.localFiles[this.localFiles.length - 1].iconName = this.getFileIconName(fileExtension)
        }

        this.isMultiple ? this.fileCounter++ : ''
        this.$emit('change:files', this.formData)
      }

      if (this.fileType === 'image') reader.readAsDataURL(file)
      if (this.fileType === 'document') reader.readAsText(file)
    },
    handleFileTitle(fileIndex) {
      if (this.localFiles[fileIndex].id) {
        this.$emit('update-image', this.localFiles[fileIndex])
      } else {
        this.formData.set(`title[${fileIndex}]`, this.localFiles[fileIndex].title)
      }
    },
    removeImage(index) {
      if (this.localFiles[index].id) this.$emit('delete-image', this.localFiles[index])
      if (this.localFiles.length - this.fileCounter <= index) {
        this.formData.delete(`file[${this.localFiles.length - this.fileCounter}]`)
      }
      this.localFiles.splice(index, 1)
      this.isMultiple && this.fileCounter ? this.fileCounter-- : ''
    }
  }
}
</script>
