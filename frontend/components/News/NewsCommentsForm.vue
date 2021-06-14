<template>
  <form class="d-flex comments-form" @submit.prevent="submitForm">
    <textarea
      v-model="commentText"
      type="text"
      class="comments-form__input border mr-sm-5 mb-sm-0 mb-2"
      placeholder="Ваш комментарий..."
    />
    <base-button class="align-self-start" type="submit" size="lg" rounded="pill" fill="primary">
      <span v-if="isEditMode">Сохранить</span>
      <span v-else>Отправить</span>
      <loader v-if="isUpdating" class="ml-2" size="sm" color="white" />
    </base-button>
  </form>
</template>

<script>
import http from '@/modules/http'
import postCommentsMixin from '@/mixins/postComments.mixin'

export default {
  name: 'NewsCommentsForm',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    Loader: () => import('@/components/Elements/Loader')
  },
  props: {
    editMode: {
      type: String,
      default: 'add'
    },
    commentData: {
      type: Object
    }
  },
  mixins: [postCommentsMixin],
  data() {
    return {
      comments: [],
      commentText: '',
      isUpdating: false
    }
  },
  async created() {
    if (this.isEditMode) {
      this.commentText = this.commentData.text
    }
  },
  methods: {
    async submitForm() {
      this.isUpdating = true
      if (this.isAddMode || this.isReplyMode) {
        this.commentText ? await this.addComment() : ''
      } else {
        this.commentText ? await this.editComment() : ''
      }
      this.isUpdating = false
    },
    async addComment() {
      const formData = {
        parent: this.isReplyMode ? this.commentData.id : null,
        text: this.commentText
      }
      await http
        .post(`/posts/${this.postId}/comments`, formData)
        .then(response => {
          if (this.isReplyMode) {
            this.$emit('comment:add', response.data.data)
          } else {
            this.$emit('update:comments', response.data.data)
          }
          this.commentText = ''
        })
        .finally(() => {
          this.isUpdating = false
        })
    },
    async editComment() {
      const formData = {
        text: this.commentText
      }
      await http
        .patch(`/posts/${this.postId}/comments/${this.commentData.id}`, formData)
        .then(response => {
          this.$emit('comment:edit', response.data.data)
        })
        .finally(() => {
          this.isUpdating = false
        })
    }
  }
}
</script>
