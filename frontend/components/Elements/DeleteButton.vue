<template>
  <div>
    <base-button
      size="sm"
      type="submit"
      rounded="pill"
      fill="white"
      class="align-self-end btn-outline-danger"
      @click-btn.prevent="toggleDeleteInfoBlockModal"
    >
      <svg-icon class="transition-none" name="trash" title="Удалить" />
      <span>Удалить</span>
      <loader v-if="loaderIsActive" class="ml-2" size="sm" color="danger" />
    </base-button>
    <base-modal
      v-if="isOpenDeleteInfoBlockModal"
      :is-show="isOpenDeleteInfoBlockModal"
      @confirm="onConfirmHandler"
      @cancel="toggleDeleteInfoBlockModal"
      @close="toggleDeleteInfoBlockModal"
    >
      <template slot="header">
        <slot name="header"></slot>
      </template>
      <template slot="body">
        <slot name="body"></slot>
      </template>
      <template slot="yes">
        OK
        <loader v-if="loaderIsActive" class="ml-2" size="sm" color="white" />
      </template>
      <template slot="no">Отмена</template>
    </base-modal>
  </div>
</template>

<script>
import '@/styles/modules/modal-form.scss'

export default {
  name: 'DeleteButton',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    Loader: () => import('@/components/Elements/Loader'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    SvgIcon: () => import('@/components/Elements/SvgIcon')
  },
  props: {
    loaderIsActive: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isOpenDeleteInfoBlockModal: false
  }),
  methods: {
    toggleDeleteInfoBlockModal() {
      this.isOpenDeleteInfoBlockModal = !this.isOpenDeleteInfoBlockModal
    },
    onConfirmHandler() {
      this.$emit('confirm')
      this.toggleDeleteInfoBlockModal()
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-outline-danger {
  color: #dc3545;
  background-color: transparent;
  background-image: none;
  border-color: #dc3545;
  border: 1px solid #dc3545;
}
.btn.btn-outline-danger {
  &:hover {
    background-color: #ffdadd !important;
  }
}
</style>
