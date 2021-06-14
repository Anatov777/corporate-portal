<template>
  <div class="profile-table__row">
    <div class="profile-table__header">Комната</div>
    <div class="profile-table__column">
      {{ roomValueEdited }}
      <svg-icon
        v-if="HAVE_AUTH_USER"
        class="profile-edit-icon"
        name="edit-icon"
        title="редактировать"
        @click-icon="openEditRoomModal()"
      />
    </div>
    <base-modal
      v-if="isOpenEditRoomModal"
      :is-show="isOpenEditRoomModal"
      mode="custom"
      :has-footer="false"
      @close="toggleEditRoomModal"
    >
      <template v-slot:header>
        Редактирование комнаты
      </template>
      <template v-slot:body>
        <employee-profile-contact-edit-form
          :contact-value.sync="roomValue"
          edit-mode="edit"
          edit-contact-label="Комната"
          @form:submit="editRoom"
        />
      </template>
    </base-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'
import http from '@/modules/http'
import '@/styles/elements/_label.scss'

export default {
  name: 'EmployeeProfileContactRoom',
  components: {
    SvgIcon: () => import('@/components/Elements/SvgIcon'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    EmployeeProfileContactEditForm: () => import('@/components/Employee/EmployeeProfileContactEditForm')
  },
  mixins: [employeeContactsMixin],
  props: {
    employeeRoom: {
      type: String
    }
  },
  data: () => ({
    isOpenEditRoomModal: false,
    isUpdatingContacts: false,
    roomValue: null,
    roomValueEdited: ''
  }),
  created() {
    this.roomValueEdited = this.employeeRoom
  },
  computed: {
    ...mapGetters(['HAVE_AUTH_USER'])
  },
  methods: {
    toggleEditRoomModal() {
      this.isOpenEditRoomModal = !this.isOpenEditRoomModal
    },
    openEditRoomModal() {
      this.roomValue === null ? (this.roomValue = this.employeeRoom) : (this.roomValue = this.roomValueEdited)
      this.toggleEditRoomModal()
    },
    editRoom() {
      http
        .patch(`/employees/${this.$route.params.id}/set-room`, {
          room: this.roomValue
        })
        .then(() => {
          this.roomValueEdited = this.roomValue
          this.isOpenEditRoomModal = false
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdatingContacts = false
        })
    }
  }
}
</script>
