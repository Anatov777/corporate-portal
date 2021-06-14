<template>
  <form @submit.prevent="saveData" class="modal-form">
    <base-select
      v-if="editMode === 'add'"
      label-text="Тип контакта"
      :select-options="contactTypes"
      :selected-value.sync="selectedContact"
      :is-form-invalid.sync="isFormSelectInvalid"
    />
    <base-form-group
      :label-text="editContactLabel"
      :input-value.sync="contactInputValue"
      :is-disable-input="editMode === 'delete'"
      :is-form-invalid.sync="isFormInputInvalid"
      :form-validation-config-value="selectedContactName"
    />
    <div class="d-flex justify-content-end align-items-center mt-40">
      <base-button
        size="lg"
        type="submit"
        rounded="pill"
        fill="primary"
        :disabled="isFormInputInvalid || isFormSelectInvalid"
        @click-btn="runLoader"
      >
        <template v-if="editMode === 'delete'">OK</template>
        <template v-else>Сохранить</template>
        <loader v-if="isUpdatingContacts" class="ml-2" size="sm" color="white" />
      </base-button>
    </div>
  </form>
</template>

<script>
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'
import '@/styles/modules/modal-form.scss'

export default {
  name: 'EmployeeProfileContactEditForm',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    Loader: () => import('@/components/Elements/Loader'),
    BaseFormGroup: () => import('@/components/Elements/BaseFormGroup'),
    BaseSelect: () => import('@/components/Elements/BaseSelect')
  },
  props: {
    contactInfo: {
      type: Object,
      default: null
    },
    contactTypes: {
      type: Array,
      default: null
    },
    contactValue: {
      type: String
    },
    editMode: {
      type: String
    },
    editContactLabel: {
      type: String
    }
  },
  mixins: [employeeContactsMixin],
  data: () => ({
    isUpdatingContacts: false,
    isFormSelectInvalid: false,
    isFormInputInvalid: false,
    selectedContact: null,
    contactInputValue: null
  }),
  created() {
    this.contactInputValue = this.contactValue
    this.selectedContact = this.contactInfo
  },
  computed: {
    selectedContactName() {
      if (this.selectedContact) return this.selectedContact.name
      return null
    }
  },
  watch: {
    selectedContact() {
      this.updateFormContactInfo()
    },
    contactInputValue() {
      this.updateFormContactValue()
    }
  },
  methods: {
    saveData() {
      this.updateFormContactValue()
      this.updateFormContactInfo()
      this.$emit('form:submit')
    },
    updateFormContactValue() {
      this.$emit('update:contactValue', this.contactInputValue)
    },
    updateFormContactInfo() {
      this.$emit('update:contactInfo', this.selectedContact)
    }
  }
}
</script>
