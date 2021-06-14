<template>
  <div>
    <page-content-top>
      <h2>{{ departmentData.title }}</h2>
    </page-content-top>
    <loader v-if="loading" align="center" class="py-5" />
    <page-content-main v-else class="pb-100">
      <h2 class="mb-40">Руководитель</h2>
      <div class="d-flex employee-photo-row row director-card">
        <employee-card
          v-for="director in directorInfo"
          :key="director.id"
          :employee="director"
          :department-text-color="getDepartmentColorClassName(departmentData.id, 'text')"
        />
      </div>
      <div v-if="employeesInfo.length">
        <h2 class="mb-40">Сотрудники</h2>
        <div class="d-flex employee-photo-row row director-card">
          <employee-card
            v-for="employee in employeesInfo"
            :key="employee.id"
            :employee="employee"
            :department-text-color="getDepartmentColorClassName(departmentData.id, 'text')"
          />
        </div>
      </div>
      <div v-for="division in departmentItems" :key="division.id" class="department-list flex-column">
        <h2>{{ division.title }}</h2>
        <department-employees-element :division-id="division.id" />
        <div v-if="hasChildren(division)">
          <div v-for="child in division.children" :key="child.id" class="mb-20">
            <h3>{{ child.title }}</h3>
            <department-employees-element :division-id="child.id" class="mt-40" />
          </div>
        </div>
      </div>
    </page-content-main>
  </div>
</template>

<script>
import http from '@/modules/http'
import '@/styles/modules/employee/departments.scss'
import { mapActions } from 'vuex'
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'

export default {
  name: 'DepartmentPage',
  components: {
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    EmployeeCard: () => import('@/components/Employee/EmployeeCard'),
    DepartmentEmployeesElement: () => import('@/components/Employee/DepartmentEmployeesElement'),
    Loader: () => import('@/components/Elements/Loader')
  },
  mixins: [departmentsFeaturesMixin],
  data: () => ({
    departmentData: {},
    departments: null,
    loading: true
  }),
  async created() {
    try {
      this.departmentData = (await http.get(`/employees/divisions/${this.divisionId}`)).data.data
      this.getDepartmentItems()
      this.SET_DEPARTMENT_ID(this.departmentData.id)
    } catch (error) {
      console.error('Error', error)
    } finally {
      this.loading = false
    }
  },
  computed: {
    divisionId() {
      return this.$route.path.split('/').pop()
    },
    directorInfo() {
      if (this.departmentData) {
        return this.departmentData.employees.filter(person => person.id === this.departmentData.director.id)
      }
      return null
    },
    employeesInfo() {
      if (this.departmentData) {
        return this.departmentData.employees.filter(person => person.id !== this.departmentData.director.id)
      }
      return null
    },
    departmentItems() {
      if (this.departments) {
        return this.departments.filter(elem => {
          if (elem.parent) {
            return elem.parent.id === +this.divisionId
          }
        })
      }
      return null
    }
  },
  methods: {
    ...mapActions(['SET_DEPARTMENT_ID']),
    async getDepartmentItems() {
      try {
        this.departments = (await http.get(`/employees/divisions`)).data.data
      } catch (error) {
        console.log('Error', error)
      }
    },
    hasChildren(division) {
      return division.children.length > 0
    }
  }
}
</script>
