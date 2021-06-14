<template>
  <div class="honor-board-list d-flex flex-wrap flex-gap-12">
    <base-card v-for="employee in employees" :key="employee.id" :employee="employee" />
  </div>
</template>

<script>
import '@/styles/elements/_gaps.scss'

export default {
  name: 'HonorBoardEmployeeList',
  components: {
    BaseCard: () => import('@/components/Elements/BaseCard')
  },
  props: {
    employees: {
      type: Array
    }
  }
}
</script>
