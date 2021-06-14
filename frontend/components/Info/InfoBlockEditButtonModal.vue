<template>
  <div>
    <base-button rounded="pill" fill="primary" size="lg" @click-btn="toggleEditInfoBlockModal">
      <span v-if="mode === 'add'">Добавить блок</span>
      <span v-else>Редактировать блок</span>
    </base-button>
    <base-modal
      v-if="isOpenEditInfoBlockModal"
      :is-show="isOpenEditInfoBlockModal"
      :hasFooter="false"
      size="medium"
      mode="custom"
      @close="toggleEditInfoBlockModal"
    >
      <template slot="header">
        <span v-if="mode === 'add'">Добавить блок</span>
        <span v-else>Редактировать блок</span>
      </template>
      <template slot="body">
        <info-block-edit-form
          :mode="mode"
          :block-files.sync="attachedFilesCopy"
          :active-block-data="activeBlockData"
          @delete:file="$emit('delete:file')"
          @update:image="$emit('update:image', $event)"
          @update:file="$emit('update:file', $event)"
          @delete:block="$emit('delete:block', $event)"
          @close-modal="toggleEditInfoBlockModal"
        />
      </template>
    </base-modal>
  </div>
</template>

<script>
export default {
  name: 'InfoBlockEditButtonModal',
  components: {
    InfoBlockEditForm: () => import('@/components/Info/InfoBlockEditForm'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    BaseButton: () => import('@/components/Elements/BaseButton')
  },
  props: {
    mode: {
      type: String,
      default: 'edit'
    },
    attachedFiles: {
      type: Array
    },
    activeBlockData: {
      type: Object
    }
  },
  data() {
    return {
      isOpenEditInfoBlockModal: false
    }
  },
  created() {
    this.attachedFilesCopy = this.attachedFiles
  },
  methods: {
    toggleEditInfoBlockModal() {
      this.isOpenEditInfoBlockModal = !this.isOpenEditInfoBlockModal
    }
  }
}
</script>
