<template>
  <div v-if="hasEmployees">
    <div class="d-flex employee-photo-row row">
      <employee-card
        v-for="employee in divisionData.employees"
        :key="employee.id"
        :employee="employee"
        :department-text-color="getDepartmentColorClassName(GET_DEPARTMENT_ID, 'text')"
      />
    </div>
  </div>
</template>

<script>
import http from '@/modules/http'
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'DepartmentEmployeesElement',
  components: {
    EmployeeCard: () => import('@/components/Employee/EmployeeCard')
  },
  mixins: [departmentsFeaturesMixin],
  props: {
    divisionId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    divisionData: null
  }),
  async created() {
    try {
      this.divisionData = (await http.get(`/employees/divisions/${this.divisionId}`)).data.data
    } catch (error) {
      console.log(error)
    }
  },
  computed: {
    ...mapGetters(['GET_DEPARTMENT_ID']),
    hasEmployees() {
      if (this.divisionData) {
        return this.divisionData.employees.length > 0
      }
      return 0
    }
  }
}
</script>
