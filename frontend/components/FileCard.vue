<template>
  <div class="col-sm-6 file">
    <div class="file-item">
      <div class="file-item-content">
        <div>
          <span class="file-title">{{ file.title }}</span>
        </div>
        <div class="file-btn-wrapper">
          <file-link :file="file" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/styles/elements/_file.scss'
export default {
  components: {
    FileLink: () => import('@/components/FileLink')
  },
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  name: 'FileCard'
}
</script>
