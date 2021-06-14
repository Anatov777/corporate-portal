<template>
  <div>
    <div v-if="hasGalleryImages">
      <news-gallery-slider class="mb-5 news-item-slider" :slides="galleryImagesPaths" />
    </div>
    <div class="d-flex justify-content-center">
      <base-button
        v-if="hasEditButton"
        size="lg"
        fill="primary"
        rounded="pill"
        class="d-flex justify-content-center align-items-center"
        @click-btn="toggleEditGalleryModal"
      >
        <span v-if="!hasGalleryImages">Добавить галерею</span>
        <span v-if="hasGalleryImages">Редактировать галерею</span>
      </base-button>
    </div>

    <base-modal
      v-if="isOpenEditGalleryModal"
      :is-show="isOpenEditGalleryModal"
      :hasFooter="false"
      size="small"
      mode="custom"
      @close="toggleEditGalleryModal"
    >
      <template slot="header">
        <span v-if="!hasGalleryImages">Добавить галерею</span>
        <span v-else>Редактировать галерею</span>
      </template>
      <template slot="body">
        <news-files-edit-form
          v-if="hasGalleryImages"
          mode="edit"
          :files.sync="images"
          @update:files="updateFiles"
          @close-modal="toggleEditGalleryModal"
        />
        <news-files-edit-form
          v-else
          :files.sync="images"
          @update:files="updateFiles"
          @close-modal="toggleEditGalleryModal"
        />
      </template>
    </base-modal>
  </div>
</template>

<script>
export default {
  name: 'NewsGallery',
  components: {
    NewsGallerySlider: () => import('@/components/News/NewsGallerySlider'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    NewsFilesEditForm: () => import('@/components/News/NewsFilesEditForm')
  },
  props: {
    hasGalleryImages: {
      type: Boolean,
      required: true,
      default: false
    },
    galleryImages: {
      type: Array,
      required: true
    },
    hasEditButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      images: null,
      isOpenEditGalleryModal: false
    }
  },
  created() {
    this.images = this.galleryImages
  },
  computed: {
    galleryImagesPaths() {
      let paths = []
      this.galleryImages.forEach(item => {
        paths.push(item.path)
      })
      return paths
    }
  },
  methods: {
    toggleEditGalleryModal() {
      this.isOpenEditGalleryModal = !this.isOpenEditGalleryModal
    },
    updateFiles() {
      this.$emit('update:galleryImages', this.images)
    }
  }
}
</script>
