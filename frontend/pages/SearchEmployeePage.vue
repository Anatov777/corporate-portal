<template>
  <div>
    <page-content-top>
      <div class="d-flex justify-content-start align-items-center">
        <h2 class="title">Поиск сотрудников</h2>
      </div>
    </page-content-top>
    <page-content-main ref="employeesContent">
      <loader v-show="loading" class="py-5" align="center" />
      <div v-if="searchResult" class="employee-photo-list row pb-100">
        <employee-card
          v-for="employee in searchResult"
          :key="employee.id"
          :employee="employee"
          :department-text-color="getDepartmentColorClassNameByChild(employee.division, 'text')"
        />
      </div>
      <div v-else class="employee-photo-list row pb-100">
        Поиск не дал результатов
      </div>
    </page-content-main>
  </div>
</template>

<script>
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'
import '@/styles/modules/employee/employee-photo.scss'

export default {
  name: 'SearchEmployeePage',
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    EmployeeCard: () => import('@/components/Employee/EmployeeCard'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain')
  },
  mixins: [departmentsFeaturesMixin],
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.loading = false
  },
  computed: {
    searchResult() {
      return this.$route.params.searchEmployeeResult
    }
  }
}
</script>
