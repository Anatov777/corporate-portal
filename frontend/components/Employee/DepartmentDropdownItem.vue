<template>
  <div class="departments__dropdown" @click.stop>
    <div
      :class="[
        'departments__dropdown-link',
        { 'pointing-arrow': divisionEmployeeIndex === index },
        `${getDepartmentColorClassName(GET_DEPARTMENT_ID, 'bg-secondary')}`
      ]"
      v-for="(child, index) in departmentData"
      :key="child.id"
      @click="togglePersonsList(index)"
    >
      <div :class="`departments__dropdown-item ${getDepartmentColorClassName(GET_DEPARTMENT_ID, 'text')}`">
        {{ child.title }}
      </div>
      <department-employees v-if="divisionEmployeeIndex === index" :division-id="child.id" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'

export default {
  name: 'DepartmentDropdownItem',
  components: {
    DepartmentEmployees: () => import('@/components/Employee/DepartmentEmployees')
  },
  mixins: [departmentsFeaturesMixin],
  inject: ['divisionData'],
  props: {
    divisionId: Number
  },
  data: () => ({
    divisionEmployeeIndex: null
  }),
  computed: {
    departmentData() {
      let divisionData = [...this.divisionData.children]
      divisionData.unshift(this.divisionData)
      return divisionData
    },
    ...mapGetters(['GET_DEPARTMENT_ID'])
  },
  methods: {
    togglePersonsList(itemIndex) {
      this.divisionEmployeeIndex = this.divisionEmployeeIndex === itemIndex ? null : itemIndex
    }
  }
}
</script>
