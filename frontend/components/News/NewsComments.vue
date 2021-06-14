<template>
  <div class="bg--grey comments">
    <div class="container">
      <h3 class="comments__title">
        Комментарии
      </h3>

      <news-comments-form v-if="hasForm" @update:comments="changeComment($event, 'add')" />
      <div class="comments__users">
        <div class="comments-amount">{{ commentsNumber }} {{ commentDeclension }}</div>
        <comment
          v-for="comment in comments"
          :key="comment.id"
          :comment-data="comment"
          :active-comment-id="activeCommentId"
          :employees="employees"
          @toggle:reply-form="toggleReplyForm($event)"
          @comment:edit="changeComment($event, 'edit')"
          @comment:delete="changeComment($event, 'delete')"
          @comment:add="changeComment($event, 'reply')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/modules/http'
import getDeclension from '@/functions/getDeclension'
import postCommentsMixin from '@/mixins/postComments.mixin'

export default {
  name: 'NewsComments',
  components: {
    Comment: () => import('@/components/Comment'),
    NewsCommentsForm: () => import('@/components/News/NewsCommentsForm')
  },
  props: {
    hasForm: {
      type: Boolean,
      default: false
    }
  },
  mixins: [postCommentsMixin],
  data() {
    return {
      comments: [],
      employees: [],
      commentText: '',
      activeCommentId: 0,
      editMode: ''
    }
  },
  async created() {
    await this.fetchEmployees()
    await this.fetchComments()
  },
  computed: {
    commentsNumber() {
      return this.getCommentsNumber(this.comments)
    },
    commentDeclension() {
      const commentDeclensions = ['Комментарий', 'Комментария', 'Комментариев']
      return getDeclension(this.commentsNumber, commentDeclensions)
    }
  },
  methods: {
    async fetchComments() {
      this.comments = (await http.get(`/posts/${this.postId}/comments`)).data.data
    },
    async fetchEmployees() {
      this.employees = (await http.get(`/employees`)).data.data
    },
    toggleReplyForm(commentId) {
      this.activeCommentId = commentId
    },
    getCommentsNumber(commentsArray) {
      let number = commentsArray.length
      commentsArray.forEach(comment => {
        if (comment.children) {
          number += this.getCommentsNumber(comment.children)
        }
      })
      return number
    },
    changeComment(newComment, mode) {
      this.editMode = mode
      if (newComment.parent) {
        let newCommentParent = this.findCommentParent(this.comments, newComment.parent)
        this.changeCommentByEditMode(newCommentParent.children, newComment)
      } else {
        this.changeCommentByEditMode(this.comments, newComment)
      }
    },
    findCommentParent(comments, newCommentParentId) {
      let commentParent = comments.find(element => element.id === newCommentParentId)
      if (!commentParent) {
        for (let comment of comments) {
          if (comment.children) {
            commentParent = this.findCommentParent(comment.children, newCommentParentId)
            if (commentParent) {
              return commentParent
            }
          }
        }
      }
      return commentParent
    },
    changeCommentByEditMode(comments, newComment) {
      if (this.isAddMode || this.isReplyMode) {
        comments.push(newComment)
        return
      }
      const commentIndex = comments.findIndex(item => item.id === newComment.id)
      if (this.isEditMode) {
        comments.splice(commentIndex, 1, newComment)
      } else {
        comments.splice(commentIndex, 1)
      }
    }
  }
}
</script>
