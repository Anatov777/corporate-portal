<template>
  <a
    class="btn btn--sm file-btn rounded-pill btn-outline-primary"
    :href="file.path"
    :download="isFileForDownload ? file.title : false"
    :target="isFileForDownload ? false : '_blank'"
    :class="isFileForDownload ? 'btn-download' : ''"
  >
    <svg-icon class="transition-none" v-if="isFileForDownload" name="download" title="Скачать" />
    <span>{{ buttonText }}</span>
  </a>
</template>

<script>
export default {
  name: 'FileLink',
  props: {
    file: {
      type: Object
    },
    buttonTextMode: {
      type: String,
      default: 'adaptive'
    }
  },
  components: {
    SvgIcon: () => import('@/components/Elements/SvgIcon')
  },
  computed: {
    extension() {
      if (this.file?.path) {
        let fullPathToArray = this.file.path.split('/')
        let fileName = fullPathToArray[fullPathToArray.length - 1].split('.')
        return fileName[fileName.length - 1]
      }
      return ''
    },
    isFileForDownload() {
      return this.extension !== 'pdf' || this.buttonTextMode === 'download'
    },
    buttonText() {
      if (this.extension === 'pdf' && this.buttonTextMode !== 'download') return 'Посмотреть файл'
      return 'Скачать файл'
    }
  }
}
</script>
