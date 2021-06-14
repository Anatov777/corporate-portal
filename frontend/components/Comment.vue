<template>
  <div>
    <div class="comment bg--grey">
      <div class="comment-avatar">
        <base-image :image-path="employeeAvatar" :image-alt="employeeName" is-background-image />
      </div>
      <div class="w-100">
        <div class="comment-username">
          {{ employeeName }}
        </div>
        <div class="comment-date">
          {{ commentDate }}
        </div>
        <div class="comment-text">
          <p v-if="!isEditMode">
            {{ commentData.text }}
          </p>
          <news-comments-form
            v-else-if="isActiveComment"
            edit-mode="edit"
            :comment-data="commentData"
            @comment:edit="emitCommentData($event, 'edit')"
          />
        </div>
        <div class="comment-buttons">
          <button class="comment-buttons-item" v-if="HAVE_AUTH_USER" @click="toggleReplyForm">
            Ответить
          </button>

          <button class="comment-buttons-item" v-if="hasEditingRights" @click="toggleEditForm">
            Изменить
          </button>

          <button class="comment-buttons-item" v-if="hasEditingRights" @click="toggleDeleteModal">
            Удалить
          </button>
        </div>
        <base-modal
          v-if="isDeleteMode"
          :is-show="isDeleteMode"
          @confirm="deleteComment"
          @cancel="toggleDeleteModal"
          @close="toggleDeleteModal"
        >
          <template slot="header">
            Удаление комментария
          </template>
          <template slot="body">
            Точно удалить комментарий?
          </template>
          <template slot="yes">
            OK
            <loader v-if="isUpdating" class="ml-2" size="sm" color="white" />
          </template>
          <template slot="no">Отмена</template>
        </base-modal>
      </div>
    </div>
    <news-comments-form
      v-if="commentReplyFormIsVisible"
      edit-mode="reply"
      :comment-data="commentData"
      class="mt-10 ml-100"
      @comment:add="emitCommentData($event, 'add')"
    />

    <comment
      v-for="comment in commentData.children"
      :key="comment.id"
      :comment-data="comment"
      :active-comment-id="activeCommentId"
      :employees="employees"
      class="ml-20"
      @toggle:reply-form="toggleReplyForm($event)"
      @comment:edit="$emit('comment:edit', $event)"
      @comment:delete="$emit('comment:delete', $event)"
      @comment:add="emitCommentData($event, 'add')"
    />
  </div>
</template>

<script>
import '@/styles/elements/_comment.scss'
import { mapGetters } from 'vuex'
import http from '@/modules/http'
import postCommentsMixin from '@/mixins/postComments.mixin'
import commentEditModes from '@/config/commentsEditModes'

export default {
  name: 'Comment',
  components: {
    NewsCommentsForm: () => import('@/components/News/NewsCommentsForm'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    BaseImage: () => import('@/components/Elements/BaseImage'),
    Comment: () => import('@/components/Comment'),
    Loader: () => import('@/components/Elements/Loader')
  },
  props: {
    commentData: {
      type: Object
    },
    activeCommentId: {
      type: Number
    },
    employees: {
      type: Array
    }
  },
  mixins: [postCommentsMixin],
  data() {
    return {
      editMode: null,
      isUpdating: false
    }
  },
  watch: {
    activeCommentId() {
      if (!this.isActiveComment) {
        this.editMode = null
      }
    }
  },
  computed: {
    ...mapGetters(['HAVE_AUTH_USER', 'AUTH_USER']),
    commentReplyFormIsVisible() {
      return this.isActiveComment && this.isAddMode
    },
    isActiveComment() {
      return this.commentData.id === this.activeCommentId
    },
    commentDate() {
      return this.moment(this.commentData.date, 'DD-MM-YYYY')
        .format('LL')
        .slice(0, -3)
    },
    hasEditingRights() {
      let nowDate = this.moment(new Date(), 'DD-MM-YYYY')
      let commentDate = this.moment(this.commentData.date, 'DD.MM.YYYY')
      let commentPublishingHoursPassed = nowDate.diff(commentDate, 'hours')
      return (
        this.AUTH_USER?.id === this.commentData.author.id &&
        this.HAVE_AUTH_USER &&
        commentPublishingHoursPassed < 24
      )
    },
    employeeData() {
      return this.employees.find(item => item.user === this.commentData.author.id)
    },
    employeeAvatar() {
      return this.employeeData?.photo
    },
    employeeName() {
      if (this.employeeData) {
        return `${this.employeeData.name} ${this.employeeData.surname}`
      }
      return ''
    }
  },
  methods: {
    toggleReplyForm(childId) {
      if (typeof childId === 'number') {
        this.$emit('toggle:reply-form', childId)
      } else {
        this.$emit('toggle:reply-form', this.commentData.id)
      }
      this.editMode = commentEditModes.ADD_MODE
    },
    toggleEditForm() {
      this.editMode = commentEditModes.EDIT_MODE
      if (this.isAddMode) {
        this.$emit('toggle:reply-form', null)
      } else {
        this.$emit('toggle:reply-form', this.commentData.id)
      }
    },
    emitCommentData(newCommentData, mode) {
      this.editMode = mode
      if (this.isAddMode) {
        this.$emit('comment:add', newCommentData)
      } else {
        this.$emit('comment:edit', newCommentData)
      }
      this.hideForm()
    },
    hideForm() {
      this.editMode = null
    },
    toggleDeleteModal() {
      if (this.isDeleteMode) {
        this.editMode = null
      } else {
        this.editMode = commentEditModes.DELETE_MODE
      }
    },
    async deleteComment() {
      this.isUpdating = true
      await http
        .delete(`/posts/${this.postId}/comments/${this.commentData.id}`)
        .then(() => {
          this.$emit('comment:delete', this.commentData)
          this.toggleDeleteModal()
        })
        .finally(() => {
          this.isUpdating = false
        })
    }
  }
}
</script>
