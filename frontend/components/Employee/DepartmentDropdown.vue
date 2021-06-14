<template>
  <div
    :class="{ 'pointing-arrow': hasPointingArrow, open: dropdownArrowIsRotated }"
    @click="toggleDropdown"
    v-on-clickaway="closeDropdown"
  >
    <div class="departments__title">{{ departmentData.title }}</div>
    <department-dropdown-content />
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'
import { mapActions } from 'vuex'

export default {
  name: 'DepartmentDropdown',
  components: {
    DepartmentDropdownContent: () => import('@/components/Employee/DepartmentDropdownContent')
  },
  mixins: [clickaway],
  props: {
    departmentData: Object,
    departmentId: Number
  },
  provide() {
    return {
      sharedState: this.sharedState,
      divisionData: this.departmentData
    }
  },
  data() {
    return {
      sharedState: {
        dropdownActive: false
      }
    }
  },
  computed: {
    hasPointingArrow() {
      return this.sharedState.dropdownActive && !this.departmentData.children.length
    },
    dropdownArrowIsRotated() {
      return this.sharedState.dropdownActive && this.departmentData.children.length
    }
  },
  methods: {
    ...mapActions(['SET_DEPARTMENT_ID']),
    toggleDropdown() {
      if (!this.sharedState.dropdownActive) {
        this.SET_DEPARTMENT_ID(this.departmentId)
      }
      this.sharedState.dropdownActive = !this.sharedState.dropdownActive
    },
    closeDropdown() {
      this.sharedState.dropdownActive = false
    }
  }
}
</script>
