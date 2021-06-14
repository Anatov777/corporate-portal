import commentEditModes from '@/config/commentsEditModes'

export default {
  computed: {
    postId() {
      return this.$route.params.id
    },
    isAddMode() {
      return this.editMode === commentEditModes.ADD_MODE
    },
    isReplyMode() {
      return this.editMode === commentEditModes.REPLY_MODE
    },
    isEditMode() {
      return this.editMode === commentEditModes.EDIT_MODE
    },
    isDeleteMode() {
      return this.editMode === commentEditModes.DELETE_MODE
    }
  }
}
