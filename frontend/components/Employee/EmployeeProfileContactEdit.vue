<template>
  <div>
    <base-modal
      v-if="isOpenModalEditContact"
      :is-show="isOpenModalEditContact"
      mode="custom"
      :has-footer="false"
      @close="closeEditModal"
    >
      <template slot="header">
        {{ modalTitle }}
      </template>
      <template slot="body">
        <employee-profile-contact-edit-form
          :contact-info.sync="contactInfo"
          :contact-types="contactTypes"
          :contact-value.sync="contactValue"
          :edit-mode="editMode"
          :edit-contact-label="editContactLabel"
          @form:submit="saveContact"
        />
      </template>
    </base-modal>
  </div>
</template>

<script>
import http from '@/modules/http'
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'

export default {
  name: 'EmployeeProfileContactEdit',
  components: {
    BaseModal: () => import('@/components/Elements/BaseModal'),
    EmployeeProfileContactEditForm: () => import('@/components/Employee/EmployeeProfileContactEditForm')
  },
  props: {
    editMode: {
      type: String
    },
    modalTitle: {
      type: String
    },
    contactData: {
      type: Object
    },
    employeeContacts: {
      type: Array
    },
    contactTypes: {
      type: Array
    }
  },
  mixins: [employeeContactsMixin],
  data: () => ({
    contactValue: null,
    isOpenModalEditContact: true,
    isUpdatingContacts: false,
    contactInfo: null
  }),
  created() {
    if (this.contactData.contactTypeValueData) {
      this.contactValue = this.contactData.contactTypeValueData.contact.replace(/(&nbsp;)+/gi, ' ')
    } else {
      this.contactValue = ''
    }
  },
  computed: {
    editContactLabel() {
      if (this.editMode === 'add') return 'Значение'
      return this.contactData.contactTypeData.type
    }
  },
  methods: {
    toggleModalEditContact() {
      this.isOpenModalEditContact = !this.isOpenModalEditContact
    },
    closeEditModal() {
      this.toggleModalEditContact()
      this.$emit('close-edit-contact')
    },
    async saveContact() {
      if (this.editMode === 'add') await this.addContact()
      else if (this.editMode === 'delete') await this.deleteContact()
      else await this.editContact()
    },
    addContact() {
      http
        .post(`/employees/contacts`, {
          employee: this.$route.params.id,
          contact: this.contactValue,
          type: this.contactInfo.id,
          from1c: null
        })
        .then(() => {
          this.$emit('update-contact')
          this.closeEditModal()
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdatingContacts = false
        })
    },
    editContact() {
      http
        .patch(`/employees/contacts/${this.contactData.contactTypeValueData.id}`, {
          id: this.contactData.contactTypeValueData.id,
          employee: this.$route.params.id,
          contact: this.contactValue,
          type: this.contactData.contactTypeData.typeId,
          from1c: null
        })
        .then(() => {
          this.setContactValue(this.contactData.contactTypeData.typeId)
          this.closeEditModal()
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdatingContacts = false
        })
    },
    deleteContact() {
      http
        .delete(`/employees/contacts/${this.contactData.contactTypeValueData.id}`)
        .then(() => {
          this.setContactValue(this.contactData.contactTypeData.typeId)
          this.closeEditModal()
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdatingContacts = false
        })
    },
    setContactValue(currentTypeId) {
      const values = this.contactTypeValues(this.employeeContacts, currentTypeId)
      const value = values.find(contact => contact.id === this.contactData.contactTypeValueData.id)

      if (this.editMode === 'delete') {
        const valueIndex = values.indexOf(value)
        values.splice(valueIndex, 1)
      } else {
        value.contact = this.contactValue
      }
    }
  }
}
</script>
