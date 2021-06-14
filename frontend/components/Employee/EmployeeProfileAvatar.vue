<template>
  <div class="profile-card__photo position-relative">
    <base-image :image-path="avatarPath" :imageAlt="avatarPath" />
    <div
      v-if="hasEditingRights"
      class="profile-edit-icon-wrapper"
      @click="toggleEditAvatarModal"
      role="button"
      title="поменять фото"
    >
      <svg-icon class="profile-edit-icon" name="edit-icon" :has-hover="true" />
    </div>
    <base-modal
      v-if="isOpenEditAvatarModal"
      :is-show="isOpenEditAvatarModal"
      mode="custom"
      :has-footer="false"
      @close="toggleEditAvatarModal"
    >
      <template slot="header">
        Смена фото профиля
      </template>
      <template slot="body">
        <employee-profile-avatar-edit-form
          :image-path="avatarPath"
          @update:image="$emit('update:image', $event)"
          @close-modal="toggleEditAvatarModal"
        />
      </template>
    </base-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'EmployeeProfileAvatar',
  components: {
    EmployeeProfileAvatarEditForm: () => import('@/components/Employee/EmployeeProfileAvatarEditForm'),
    BaseImage: () => import('@/components/Elements/BaseImage'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    SvgIcon: () => import('@/components/Elements/SvgIcon')
  },
  props: {
    avatarPath: {
      type: String
    }
  },
  data: () => ({
    isOpenEditAvatarModal: false
  }),
  computed: {
    hasEditingRights() {
      return this.HAS_RIGHTS()(['employee.manage'])
    }
  },
  methods: {
    ...mapGetters(['HAS_RIGHTS']),
    toggleEditAvatarModal() {
      this.isOpenEditAvatarModal = !this.isOpenEditAvatarModal
    }
  }
}
</script>
<style lang="scss" scoped>
.profile-card__photo {
  height: fit-content;
}
.profile-edit-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  position: absolute;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  border-radius: 50%;
  &:hover {
    opacity: 0.95;
  }
  .profile-edit-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
