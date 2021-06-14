<template>
  <div class="profile-table">
    <div v-for="contact in employeeContacts" :key="contact.typeId" class="profile-table__row">
      <div class="profile-table__header">{{ contact.type }}</div>
      <div class="profile-table__column">
        <div class="d-flex flex-column flex-gap-10">
          <div v-for="value in contact.values" :key="value.id" class="d-flex align-items-center flex-gap-10">
            <span
              v-if="!isEmail(contact.typeId)"
              :class="{
                'rounded-pill bg-primary text-white profile-contacts-phone-label': isPhoneJob(contact.typeId)
              }"
              v-html="value.contact"
            >
            </span>
            <a v-else :href="`mailto:${value.contact}`">{{ value.contact }} </a>
            <svg-icon
              v-if="hasEditingRights && !value.from1c"
              class="profile-edit-icon"
              name="edit-icon"
              title="редактировать"
              @click-icon="openEditContactModal(value, contact)"
            />
            <svg-icon
              v-if="hasEditingRights && !value.from1c"
              class="profile-edit-icon"
              name="close-icon"
              title="удалить"
              @click-icon="openEditContactModal(value, contact, 'delete')"
            />
          </div>
        </div>
      </div>
    </div>
    <employee-profile-contact-room :employee-room.sync="employeeRoom" />
    <div>
      <base-button
        size="lg"
        rounded="pill"
        fill="primary"
        type="submit"
        @click-btn="openEditContactModal('', '', 'add')"
      >
        Добавить контакт
      </base-button>
    </div>
    <employee-profile-contact-edit
      v-if="isOpenEditContactModal"
      :edit-mode="editMode"
      :modal-title="modalTitle"
      :contact-data="activeEditContactInfo"
      :employee-contacts="employeeContacts"
      :contact-types="contactTypes"
      @update-contact="$emit('update-contact')"
      @close-edit-contact="toggleEditContactModal"
    />
  </div>
</template>

<script>
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'
import '@/styles/elements/_gaps.scss'
import { mapGetters } from 'vuex'

export default {
  name: 'EmployeeProfileContact',
  components: {
    SvgIcon: () => import('@/components/Elements/SvgIcon'),
    EmployeeProfileContactEdit: () => import('@/components/Employee/EmployeeProfileContactEdit'),
    EmployeeProfileContactRoom: () => import('@/components/Employee/EmployeeProfileContactRoom'),
    BaseButton: () => import('@/components/Elements/BaseButton')
  },
  mixins: [employeeContactsMixin],
  props: {
    employeeContacts: {
      type: Array
    },
    contactTypes: {
      type: Array
    },
    employeeRoom: {
      type: String
    }
  },
  data: () => ({
    isOpenEditContactModal: false,
    activeEditContactInfo: null,
    editMode: null,
    modalTitle: null
  }),
  computed: {
    hasEditingRights() {
      return this.HAS_RIGHTS()(['employee.manage', 'info.own.manage'])
    }
  },
  methods: {
    ...mapGetters(['HAS_RIGHTS']),
    toggleEditContactModal() {
      this.isOpenEditContactModal = !this.isOpenEditContactModal
    },
    openEditContactModal(contactTypeValue, contactTypeInfo, mode = 'edit') {
      this.setActiveContactInfo(contactTypeValue, contactTypeInfo, mode)
      this.toggleEditContactModal()
    },
    setActiveContactInfo(contactTypeValue, contactTypeInfo, mode) {
      this.activeEditContactInfo = {
        contactTypeData: contactTypeInfo,
        contactTypeValueData: contactTypeValue
      }
      this.editMode = mode
      this.setModalTitle(mode)
    },
    setModalTitle(mode) {
      if (mode === 'add') this.modalTitle = 'Добавление контакта'
      else if (mode === 'delete') this.modalTitle = 'Удалить данный контакт?'
      else this.modalTitle = 'Редактирование контакта'
    },
    isEmail(contactId) {
      return (
        [this.employeeContactTypes.EMAIL_JOB, this.employeeContactTypes.EMAIL_PERSONAL].indexOf(contactId) !==
        -1
      )
    },
    isPhoneJob(contactId) {
      return contactId === this.employeeContactTypes.PHONE_JOB
    }
  }
}
</script>
