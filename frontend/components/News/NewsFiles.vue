<template>
  <div>
    <div v-if="hasFiles" class="row news-item-files mb-5">
      <file-card v-for="file in attachedFiles" :key="file.id" :file="file" />
    </div>
    <div class="d-flex justify-content-center mt-20">
      <base-button
        v-if="hasEditButton"
        size="lg"
        fill="primary"
        rounded="pill"
        class="d-flex justify-content-center align-items-center"
        @click-btn="toggleEditFilesModal"
      >
        <span v-if="!hasFiles">Прикрепить файлы</span>
        <span v-if="hasFiles">Изменить список файлов</span>
      </base-button>
    </div>

    <base-modal
      v-if="isOpenEditFilesModal"
      :is-show="isOpenEditFilesModal"
      :hasFooter="false"
      size="small"
      mode="custom"
      @close="toggleEditFilesModal"
    >
      <template slot="header">
        <span v-if="!hasFiles">Прикрепить файлы</span>
        <span v-else>Редактировать список файлов</span>
      </template>
      <template slot="body">
        <news-files-edit-form
          v-if="hasFiles"
          mode="edit"
          file-type="document"
          :files.sync="files"
          @update:files="updateFiles"
          @close-modal="toggleEditFilesModal"
        />
        <news-files-edit-form
          v-else
          file-type="document"
          :files.sync="files"
          @update:files="updateFiles"
          @close-modal="toggleEditFilesModal"
        />
      </template>
    </base-modal>
  </div>
</template>

<script>
export default {
  name: 'NewsGallery',
  components: {
    FileCard: () => import('@/components/FileCard'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    NewsFilesEditForm: () => import('@/components/News/NewsFilesEditForm')
  },
  props: {
    hasFiles: {
      type: Boolean,
      required: true,
      default: false
    },
    attachedFiles: {
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
      files: null,
      isOpenEditFilesModal: false
    }
  },
  created() {
    this.files = this.attachedFiles
  },
  methods: {
    toggleEditFilesModal() {
      this.isOpenEditFilesModal = !this.isOpenEditFilesModal
    },
    updateFiles() {
      this.$emit('update:attachedFiles', this.files)
    }
  }
}
</script>
