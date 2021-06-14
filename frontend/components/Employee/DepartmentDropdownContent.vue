<template>
  <transition name="dropdown-content">
    <div v-if="dropdownActive" class="division__dropdown-persons">
      <department-employees v-if="!hasChildren" :division-id="divisionData.id" />
      <department-dropdown-item v-else />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DepartmentDropdownContent',
  components: {
    DepartmentDropdownItem: () => import('@/components/Employee/DepartmentDropdownItem'),
    DepartmentEmployees: () => import('@/components/Employee/DepartmentEmployees')
  },
  inject: ['sharedState', 'divisionData'],
  computed: {
    dropdownActive() {
      return this.sharedState.dropdownActive
    },
    hasChildren() {
      return this.divisionData.children.length
    }
  }
}
</script>
