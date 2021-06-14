<template>
  <div>
    <page-content-top>
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="title">Сотрудники</h2>
        <div class="d-flex align-items-center employee-photo-print" @click="print">
          <svg-icon class="mr-2" name="print" />
          Печать для охраны
        </div>
      </div>
    </page-content-top>
    <page-content-main ref="employeesContent">
      <loader v-show="loading" class="py-5" align="center" />
      <div class="employee-photo-list row pb-100">
        <employee-card
          v-for="employee in employees"
          :key="employee.id"
          :employee="employee"
          :department-text-color="getDepartmentColorClassNameByChild(employee.division, 'text')"
        />
      </div>
    </page-content-main>
  </div>
</template>

<script>
import '@/styles/modules/employee/employee-photo.scss'
import http from '@/modules/http'
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'

export default {
  name: 'EmployeeList',
  components: {
    SvgIcon: () => import('@/components/Elements/SvgIcon'),
    Loader: () => import('@/components/Elements/Loader'),
    EmployeeCard: () => import('@/components/Employee/EmployeeCard'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain')
  },
  mixins: [departmentsFeaturesMixin],
  data: () => ({
    loading: true,
    employees: []
  }),
  async created() {
    await this.fetchEmployees()
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.employeesContent) {
        if (this.$refs.employeesContent.$el.offsetHeight > 300 && this.loading === true) {
          this.loading = false
        }
      }
    })
  },
  methods: {
    print() {
      window.print()
    },
    async fetchEmployees() {
      await http
        .get('/employees', { params: { 'o-field': `surname` } })
        .then(response => {
          this.employees = response.data.data
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
