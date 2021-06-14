<template>
  <div class="dropdown-persons" @click.stop>
    <div class="dropdown-persons__content">
      <department-employees-element :division-id="divisionId" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DepartmentEmployees',
  components: {
    DepartmentEmployeesElement: () => import('@/components/Employee/DepartmentEmployeesElement')
  },
  props: {
    divisionId: Number
  },
  mounted() {
    let leftPosition = this.$el.getBoundingClientRect().left
    this.$el.setAttribute('style', `left: -${leftPosition}px;`)
  }
}
</script>
