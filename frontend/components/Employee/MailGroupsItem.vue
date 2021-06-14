<template>
  <div :class="['mail-group-item', `${getDepartmentColorClassName(mailGroup.division.id, 'border')}`]">
    <div
      :class="['mail-group-header', `${getDepartmentColorClassName(mailGroup.division.id, 'bg-primary')}`]"
    >
      <div class="mail-group-header-title">
        {{ mailGroup.title }}
      </div>
      <div class="mail-group-header-info">
        <div class="mail-group-header-info-description">
          {{ mailGroup.description }}
        </div>
        <div class="mail-group-header-info-email">
          {{ mailGroup.email }}
        </div>
      </div>
    </div>
    <div class="mail-group-body">
      <div ref="mailGroupBody" :class="['mail-group-body-content', { 'show-more': isOpenShowMore }]">
        <div v-for="employee in mailGroup.employees" :key="employee.id">
          {{ employee.full_name }}
        </div>
        <div v-for="child in mailGroup.children" :key="`child-${child.id}`">
          <mail-groups-item-child :mail-group-child="child" :division-id="mailGroup.division.id" />
        </div>
      </div>
      <div v-if="isManyEmployees" class="mail-group-body-more">
        <div class="mail-group-body-more-text">
          <span class="text-underline-under" @click="toggleShowMore">{{ showMoreText }}</span>
        </div>
        <div class="mail-group-body-more-counter">{{ mailGroupEmployeesNumber }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'
import '@/styles/modules/employee/mail-group.scss'
import '@/styles/elements/_text.scss'

export default {
  name: 'MailGroupsItem',
  components: {
    MailGroupsItemChild: () => import('@/components/Employee/MailGroupsItemChild')
  },
  mixins: [departmentsFeaturesMixin],
  props: {
    mailGroup: {
      type: Object
    }
  },
  data: () => ({
    isOpenShowMore: false,
    isManyEmployees: false,
    mailGroupChildrenEmployeesNumber: 0
  }),
  mounted() {
    this.isManyEmployees = this.$refs.mailGroupBody.children.length > 5
  },
  computed: {
    showMoreText() {
      if (this.isOpenShowMore) return 'Скрыть'
      return 'Показать еще'
    },
    mailGroupEmployeesNumber() {
      if (this.mailGroup.children.length) {
        this.mailGroup.children.forEach(element => {
          this.mailGroupChildrenEmployeesNumber += element.employees.length
        })
      }
      return this.mailGroup.employees.length + this.mailGroupChildrenEmployeesNumber
    }
  },
  methods: {
    toggleShowMore() {
      this.isOpenShowMore = !this.isOpenShowMore
    }
  }
}
</script>
