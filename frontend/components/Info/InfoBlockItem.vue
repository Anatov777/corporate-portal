<template>
  <div class="info-item">
    <div class="row info-item-content">
      <div class="col-12 col-md-10">
        <div class="d-flex justify-content-between flex-wrap flex-gap-20 info-item__header">
          <div>
            <h4 class="info-item__title">
              {{ blockData.title }}
            </h4>
          </div>
          <div class="d-flex align-items-start justify-content-end">
            <div class="d-flex align-items-center">
              <file-link v-if="attachedFiles[0]" :file="attachedFiles[0]" buttonTextMode="download" />
            </div>
          </div>
        </div>

        <div>
          <div class="info-item-description" :class="{ 'is-toggle': isOpenDescription }">
            <div class="info-item-description-content" ref="descriptionContent" v-html="blockData.text"></div>
          </div>
          <div class="d-flex justify-content-between flex-wrap flex-gap-20 align-items-center">
            <div>
              <div
                v-if="showMoreIsVisible"
                class="info-item-more arrow-after"
                :class="{ 'is-toggle': isOpenDescription }"
                @click="toggleBlockHeight"
              >
                {{ isOpenDescription ? 'Свернуть' : 'Читать полностью' }}
              </div>
            </div>

            <info-block-edit-button-modal
              v-if="hasEditingRights"
              :active-block-data="blockData"
              :attached-files.sync="attachedFiles"
              @delete:file="deleteFile"
              @update:image="updateImage($event)"
              @update:file="updateFile($event)"
              @delete:block="$emit('delete:block', $event)"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-2 d-flex justify-content-center align-items-start">
        <base-image
          v-if="blockImage"
          :image-path="blockImage"
          :has-lazy-loading="true"
          :imageAlt="blockData.title"
          :key="`${blockData.id}${imageKey}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import '@/styles/elements/_info-item.scss'
import '@/styles/elements/_gaps.scss'
import http from '@/modules/http'

export default {
  name: 'InfoBlockItem',
  components: {
    FileLink: () => import('@/components/FileLink'),
    BaseImage: () => import('@/components/Elements/BaseImage'),
    InfoBlockEditButtonModal: () => import('@/components/Info/InfoBlockEditButtonModal')
  },
  props: {
    blockData: {
      type: Object
    },
    hasEditingRights: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpenDescription: false,
      attachedFiles: [],
      descriptionContent: null,
      blockImage: null,
      imageKey: 0
    }
  },
  async created() {
    this.attachedFiles ? await this.fetchFiles() : ''
  },
  mounted() {
    this.descriptionContent = this.$refs.descriptionContent
    this.blockImage = this.blockData.image
  },
  computed: {
    showMoreIsVisible() {
      if (this.descriptionContent?.offsetHeight >= 120) return true
      return false
    }
  },
  methods: {
    toggleBlockHeight() {
      this.isOpenDescription = !this.isOpenDescription
    },
    async fetchFiles() {
      await http.get(`/info/blocks/${this.blockData.id}/media/files`).then(response => {
        response.data.data.forEach(element => {
          this.attachedFiles.push(element)
        })
      })
    },
    deleteFile() {
      this.attachedFiles.splice(0, 1)
    },
    updateImage(imagePath) {
      this.blockImage = imagePath
      this.imageKey = `_${this.imageKey}`
    },
    updateFile(files) {
      this.attachedFiles[0] = files[0]
    }
  }
}
</script>
