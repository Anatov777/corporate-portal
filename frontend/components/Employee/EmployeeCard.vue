<template>
  <div class="employee-card-wrap col-xl-3 col-lg-4 col-md-4 col-sm-6">
    <div class="employee-card border h-100">
      <base-image
        :image-path="`${employee.photo}`"
        :has-lazy-loading="true"
        image-class="employee-card-photo"
        :imageAlt="fullName"
      />
      <div class="employee-card-body d-flex flex-column">
        <router-link class="employee-card-name" :to="employeeLink(employee.id)">
          {{ fullName }}
        </router-link>
        <span :class="`employee-card-position ${departmentTextColor}`">
          {{ employee.position }}
        </span>
        <div class="employee-card-contacts d-flex justify-content-between">
          <div class="employee-card-contacts-left d-flex flex-column">
            <span v-if="isContactExists(employee.contacts, employeeContactTypes.PHONE_MOBILE)">
              <span
                v-for="({ contact }, indexContact) in contactTypeValues(
                  employee.contacts,
                  employeeContactTypes.PHONE_MOBILE
                )"
                :key="indexContact"
                v-html="contact"
              >
              </span>
            </span>
            <span v-if="isContactExists(employee.contacts, employeeContactTypes.EMAIL_JOB)">
              <a
                :href="`mailto:${contact}`"
                v-for="({ contact }, indexContact) in contactTypeValues(
                  employee.contacts,
                  employeeContactTypes.EMAIL_JOB
                )"
                class="text"
                :key="indexContact"
              >
                {{ contact }}
              </a>
            </span>
            <span v-if="employee.room"> Комната: {{ employee.room }} </span>
          </div>
          <div class="employee-card-contacts-right d-flex justify-content-end align-self-start">
            <div
              class="employee-card-contacts-right-content"
              v-if="isContactExists(employee.contacts, employeeContactTypes.PHONE_JOB)"
            >
              <span
                class="rounded-pill bg-primary text-white employee-card-contacts-label"
                v-for="({ contact }, indexContact) in contactTypeValues(
                  employee.contacts,
                  employeeContactTypes.PHONE_JOB
                )"
                :key="indexContact"
              >
                {{ contact }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/styles/elements/employee-card.scss'
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'

export default {
  name: 'EmployeeCard',
  components: {
    BaseImage: () => import('@/components/Elements/BaseImage')
  },
  mixins: [employeeContactsMixin],
  props: {
    employee: {
      type: Object,
      required: true
    },
    departmentTextColor: {
      type: String
    }
  },
  computed: {
    fullName() {
      return this.employeeFullName(this.employee)
    }
  }
}
</script>
