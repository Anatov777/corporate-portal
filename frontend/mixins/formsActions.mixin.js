export default {
  methods: {
    onFinallyAction() {
      this.sending = false
    },
    updateFormValidInfo() {
      this.$emit('update:isFormInvalid', this.isInvalid)
    },
    runLoader() {
      this.isUpdating = true
    }
  }
}
