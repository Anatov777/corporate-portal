<template>
  <div>
    <div class="mb-10 mt-10">
      <span
        role="button"
        :class="[
          'text-underline-under-always text-uppercase text-hover-opacity',
          `${getDepartmentColorClassName(divisionId, 'text')}`
        ]"
        @click="toggleShowMore"
        >{{ mailGroupChild.title }} ({{ mailGroupChild.email }})</span
      >
      <span
        :class="[
          'mail-group-body-more-counter text-white ml-10',
          `${getDepartmentColorClassName(divisionId, 'bg-primary')}`
        ]"
        >{{ mailGroupChild.employees.length }}</span
      >
    </div>
    <div
      v-for="employee in mailGroupChild.employees"
      :key="employee.id"
      :class="['mail-group-body-content-name ml-10', { 'show-more': isOpenShowMore }]"
    >
      <template v-if="isOpenShowMore">
        {{ employee.full_name }}
      </template>
    </div>
  </div>
</template>

<script>
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'

export default {
  name: 'MailGroupsItemChild',
  mixins: [departmentsFeaturesMixin],
  props: {
    mailGroupChild: {
      type: Object
    },
    divisionId: {
      type: Number
    }
  },
  data: () => ({
    isOpenShowMore: false
  }),
  methods: {
    toggleShowMore() {
      this.isOpenShowMore = !this.isOpenShowMore
    }
  }
}
</script>
