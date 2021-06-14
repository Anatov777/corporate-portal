<template>
  <form @submit.prevent="submitForm" ref="addEmployeeForm" class="modal-form">
    <base-select
      label-text="Сотрудник"
      option-key="full_name"
      :select-options="employees"
      :selected-value.sync="selectedEmployee"
      placeholder-text="Выберите сотрудника"
      form-validation-config-value="not required"
    />
    <base-form-group
      label-text="ФИО"
      :input-value.sync="employeeFullName"
      :is-form-invalid.sync="isInvalidFullNameField"
    />
    <base-form-group
      label-text="Год получения"
      :input-value.sync="employeeRewardDate"
      :is-form-invalid.sync="isInvalidRewardDateField"
      value-type="number"
      max-length="4"
      form-validation-config-value="dateYear"
    />
    <base-form-group
      label-text="Описание заслуг"
      :input-value.sync="employeeMeritsDescription"
      :form-validation-config-value="`not required`"
      inputType="textarea"
    />
    <base-form-group label-text="Фото" :input-value.sync="employeePhoto" inputType="files" />

    <div class="d-flex justify-content-end align-items-center mt-40">
      <transition v-if="isEmptyForm" name="fade">
        <span class="mr-30 reset-form-button" @click="resetForm">Очистить</span>
      </transition>
      <base-button
        size="lg"
        type="submit"
        rounded="pill"
        fill="primary"
        :disabled="isFormInvalid"
        @click-btn="runLoader"
      >
        <span v-if="mode !== 'edit'">Добавить</span>
        <span v-else>Сохранить</span>
        <loader v-if="isUpdating" class="ml-2" size="sm" color="white" />
      </base-button>
    </div>
  </form>
</template>

<script>
import formsActionsMixin from '@/mixins/formsActions.mixin'
import http from '@/modules/http'
import '@/styles/elements/transitions/_fade.scss'
import '@/styles/elements/_reset-form-btn.scss'

export default {
  name: 'HonorBoardEditForm',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    Loader: () => import('@/components/Elements/Loader'),
    BaseFormGroup: () => import('@/components/Elements/BaseFormGroup'),
    BaseSelect: () => import('@/components/Elements/BaseSelect')
  },
  mixins: [formsActionsMixin],
  props: {
    employees: {
      type: Array
    },
    honorBoardEmployees: {
      type: Array
    },
    employeeData: {
      type: Object
    },
    mode: {
      type: String,
      default: 'add'
    }
  },
  data: () => ({
    selectedEmployee: null,
    employeeFullName: null,
    employeeRewardDate: '',
    employeeMeritsDescription: '',
    employeePhoto: null,
    isInvalidFullNameField: true,
    isInvalidRewardDateField: true,
    isUpdating: false,
    employeesData: [],
    honorBoardEmployeesData: null,
    entityId: null,
    deletedPhoto: []
  }),
  async created() {
    if (this.mode === 'edit') {
      this.setFieldsValue()
    }
    await this.setEmployees()
  },
  watch: {
    selectedEmployee() {
      this.employeeFullName = this.selectedEmployee ? this.selectedEmployee.full_name : ''
    }
  },
  computed: {
    employeeId() {
      if (this.selectedEmployee) return this.selectedEmployee.id
      return 0
    },
    isFormInvalid() {
      return this.isInvalidFullNameField || this.isInvalidRewardDateField
    },
    isEmptyForm() {
      return (
        this.selectedEmployee ||
        this.employeeFullName ||
        this.employeeRewardDate ||
        this.employeeMeritsDescription ||
        this.employeePhoto
      )
    }
  },
  methods: {
    async setEmployees() {
      if (!this.employees.length) {
        await this.fetchEmployees()
      }
    },
    setFieldsValue() {
      // this.selectedEmployee =
      this.employeeFullName = this.employeeData.full_name
      this.employeeRewardDate = this.employeeData.year
      this.employeeMeritsDescription = this.employeeData.description
      this.employeePhoto = this.employeeData.photo
    },
    async fetchEmployees() {
      this.employeesData = (await http.get('/employees', { params: { 'o-field': `surname` } })).data.data
      this.setFullName()
      this.$emit('update:employees', this.employeesData)
    },
    setFullName() {
      this.employeesData.map(employee => {
        employee.full_name = `${employee.surname} ${employee.name} ${employee.patronymic}`
      })
    },
    getFormData() {
      let formData = {
        description: this.employeeMeritsDescription,
        year: this.employeeRewardDate
      }
      if (this.employeeId && this.mode === 'add') {
        formData.employee = this.employeeId
      } else {
        formData.full_name = this.employeeFullName
      }
      return formData
    },
    async submitForm() {
      if (this.mode === 'edit') this.editEmployee()
      else this.addEmployee()
    },
    async addEmployee() {
      await http
        .post(`/employees/hall-of-fame`, this.getFormData())
        .then(response => {
          this.entityId = response.data.data.id
          this.honorBoardEmployees.push(response.data.data)
          this.$emit('close-modal')
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdating = false
        })
      this.entityId && this.employeePhoto ? await this.addEmployeePhoto() : ''
    },

    async editEmployee() {
      await http
        .patch(`/employees/hall-of-fame/${this.$route.params.id}`, this.getFormData())
        .then(response => {
          this.entityId = response.data.data.id
          this.$emit('update:employeeData', response.data.data)
          this.$emit('close-modal')
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdating = false
        })
      if (this.entityId && this.employeePhoto) {
        await this.addEmployeePhoto()
      }
    },
    async addEmployeePhoto() {
      this.employeePhoto.append('title', `${this.employeeFullName} ${this.entityId}`)
      this.employeePhoto.append('description', `Фото на доске почета для ${this.employeeFullName}`)
      this.employeePhoto.append('type', 1)

      await http
        .post(`/employees/hall-of-fame/${this.entityId}/media`, this.employeePhoto, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdating = false
        })
    },
    // async deleteEmployeePhoto() {
    //   await http
    //     .delete(`/employees/hall-of-fame/${this.entityId}/media`, {
    //       data: {
    //         id: this.entityId
    //       }
    //     })
    //     .then(response => {
    //       console.log(response)
    //     })
    // },
    setDeletedImage(event) {
      this.deletedPhoto.push(event)
    },
    resetForm() {
      this.$refs.addEmployeeForm.reset()
      this.selectedEmployee = ''
      this.employeeFullName = ''
      this.employeeRewardDate = ''
      this.employeeMeritsDescription = ''
      this.employeePhoto = null
    }
  }
}
</script>
