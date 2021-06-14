<template>
  <div>
    <page-content-top>
      <h2>Департаменты и отделы</h2>
    </page-content-top>
    <page-content-main>
      <div class="departments-primary row">
        <div
          v-for="(item, index) in departmentsWithoutChildren"
          :key="item.id"
          :class="[
            'departments-primary__item col-4',
            { 'pointing-arrow': departmentIndex === index },
            `${getDepartmentColorClassName(item.id, 'bg-primary')}`
          ]"
          @click="toggleDepartmentsWithoutChildren(index, item.id)"
        >
          {{ item.title }}
          <department-employees
            v-if="departmentIndex === index"
            :division-id="item.id"
            v-on-clickaway="closeEmployeesList"
          />
        </div>
      </div>
      <departments-list-element
        v-for="department in departmentsWithChildren"
        :key="department.id"
        :department-data="department"
      />
    </page-content-main>
  </div>
</template>

<script>
import http from '@/modules/http'
import '@/styles/modules/employee/departments.scss'
import { mixin as clickaway } from 'vue-clickaway'
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'
import { mapActions } from 'vuex'

export default {
  name: 'DepartmentsList',
  components: {
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    DepartmentsListElement: () => import('@/components/Employee/DepartmentsListElement'),
    DepartmentEmployees: () => import('@/components/Employee/DepartmentEmployees')
  },
  mixins: [clickaway, departmentsFeaturesMixin],
  data: () => ({
    departments: null,
    departmentIndex: null
  }),
  async created() {
    await this.fetchDepartments()
  },
  computed: {
    departmentsWithoutChildren() {
      if (this.departments) {
        return this.departments.filter(elem => elem.children.length === 0 && !elem.parent)
      }
      return null
    },
    departmentsWithChildren() {
      if (!this.departments) {
        return null
      }
      const departments = this.departments.filter(elem => elem.children.length > 0 && !elem.parent)
      departments.sort((d1, d2) => {return d1.order - d2.order})
      departments.forEach(department => {
        department.children.forEach(division => {
          division.children = this.departments.filter(item => {
            if (item.parent) {
              return item.parent.id === division.id
            }
          })
        })
      })
      return departments
    }
  },
  methods: {
    ...mapActions(['SET_DEPARTMENT_ID']),
    async fetchDepartments() {
      try {
        this.departments = (await http.get('/employees/divisions?o-field=order')).data.data
      } catch (error) {
        console.log('Error', error)
      }
    },
    toggleDepartmentsWithoutChildren(itemIndex, itemId) {
      if (this.departmentIndex !== itemIndex) {
        this.departmentIndex = itemIndex
        this.SET_DEPARTMENT_ID(itemId)
      } else this.departmentIndex = null
    },
    closeEmployeesList() {
      this.departmentIndex = null
    }
  }
}
</script>
