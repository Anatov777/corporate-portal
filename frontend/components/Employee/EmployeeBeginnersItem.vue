<template>
  <div>
    <div class="d-flex employee-photo-row row pb-100">
      <employee-card
        v-for="employee in beginnersFiltered"
        :key="employee.id"
        :employee="employee"
        :department-text-color="getDepartmentColorClassNameByChild(employee.division, 'text')"
      />
    </div>
  </div>
</template>

<script>
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'

export default {
  name: 'EmployeeBeginnersItem',
  components: {
    EmployeeCard: () => import('@/components/Employee/EmployeeCard')
  },
  mixins: [departmentsFeaturesMixin],
  props: {
    beginnersFiltered: {
      type: Array
    }
  }
}
</script>
