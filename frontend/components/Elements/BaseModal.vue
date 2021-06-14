<template>
  <div class="modal fade" :class="{ show: isShow }">
    <div :class="`modal-dialog modal-dialog-centered ${sizeClass}`" ref="dialog" role="dialog">
      <div class="modal-content scroll-primary">
        <div class="modal-header">
          <h4 class="modal-title">
            <slot name="header"></slot>
          </h4>
          <span class="close-icon" @click="close"></span>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div v-if="hasFooter" class="modal-footer" :class="{ 'justify-content-between': isModeConfirm }">
          <slot name="footer">
            <template v-if="isModeConfirm">
              <base-button size="sm" type="submit" rounded="pill" fill="primary" @click-btn="confirm">
                <slot name="yes">Да</slot>
              </base-button>
              <base-button
                size="sm"
                type="submit"
                rounded="pill"
                fill=""
                outline="primary"
                @click-btn="cancel"
              >
                <slot name="no">Нет</slot>
              </base-button>
            </template>
            <base-button
              v-else-if="isModeApply"
              size="lg"
              type="submit"
              rounded="pill"
              fill="primary"
              @click-btn="confirm"
            >
              <slot name="yes">Применить</slot>
            </base-button>
            <button v-else class="btn btn-dark" @click="close" type="button">
              <slot name="close">ОК</slot>
            </button>
          </slot>
        </div>
        <div>
          <slot name="extra"></slot>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade" :class="{ show: isShow }" @click="clickOutside"></div>
  </div>
</template>

<script>
import '@/styles/modules/base-modal.scss'
import '@/styles/elements/_scroll.scss'

export default {
  name: 'BaseModal',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton')
  },
  props: {
    isShow: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      default: 'confirm'
    },
    size: {
      type: String,
      required: false,
      default: 'extra-small'
    },
    hasFooter: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.$root.$on('keydown:enter', this.onEnterHandler)
    this.$root.$on('keydown:esc', this.onEscHandler)
  },
  watch: {
    isShow() {
      if (this.isShow) {
        this.$refs.dialog.focus()
      }
    }
  },
  computed: {
    isModeConfirm() {
      return this.mode === 'confirm'
    },
    isModeApply() {
      return this.mode === 'apply'
    },
    sizeClass() {
      if (!this.size) {
        return ''
      }
      return `modal-${this.size}`
    }
  },
  methods: {
    clickOutside(e) {
      if (e.target.closest('.modal-dialog') === this.$refs.dialog) {
        return
      }
      this.close()
    },
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    },
    onEnterHandler() {
      if (this.isShow) {
        this.confirm()
      }
    },
    onEscHandler() {
      if (this.isShow) {
        this.close()
      }
    }
  }
}
</script>
