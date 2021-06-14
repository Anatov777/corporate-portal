<template>
  <div>
    <page-content-top>
      <h2 class="title">Личный кабинет</h2>
    </page-content-top>
    <page-content-main class="pb-100">
      <loader v-if="loading" class="py-5" align="center" />
      <div v-else>
        <div class="profile-card">
          <employee-profile-avatar :avatar-path.sync="employee.photo" @update:image="changeAvatar($event)" />
          <div class="profile-card__info">
            <div class="mb-40">
              <h2 class="title profile-name">
                {{ fullName }}
                <span v-if="employee.maiden_surname">({{ employee.maiden_surname }})</span>
              </h2>
              <span class="profile-position d-block mb-30">
                {{ employee.position }}
              </span>
              <div class="d-flex justify-content-between align-items-end">
                <div class="d-flex flex-column">
                  <span :class="`profile-division ${departmentColor}`">{{ divisionTitle }}</span>
                  <span :class="`profile-department ${departmentColor}`">{{ departmentTitle }}</span>
                </div>
                <span class="font-italic">
                  {{ `В штате с ${employee.start_date}` }}
                </span>
              </div>
            </div>
            <div class="profile-contacts border-top border-bottom d-flex flex-wrap">
              <loader v-if="loadingContacts" class="py-5" align="center" />
              <employee-profile-contact
                v-else
                :employee-contacts="employee.contacts"
                :employee-room="employee.room"
                :contact-types="contactTypes"
                @update-contact="onChangeContact"
              />
              <employee-profile-congratulations
                :profile-birthday="profileBirthday"
                :employee-number="employee.number"
                :is-allow-congratulations.sync="employee.allow_congrat"
              />
            </div>
            <div class="more-features">
              <employee-profile-testing />
              <employee-profile-absence />
            </div>
          </div>
        </div>
        <employee-profile-education
          v-if="hasEducation"
          :employee-educations="employee.educations"
          class="profile-education mt-20"
        />
      </div>
    </page-content-main>
    <employee-profile-info v-if="employee.description" :profile-description="employee.description" />
  </div>
</template>

<script>
import '@/styles/modules/employee/profile.scss'
import http from '@/modules/http'
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'
import documentMetaMixin from '@/mixins/documentMeta.mixin'

export default {
  name: 'EmployeeProfile',
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    EmployeeProfileAvatar: () => import('@/components/Employee/EmployeeProfileAvatar'),
    EmployeeProfileAbsence: () => import('@/components/Employee/EmployeeProfileAbsence'),
    EmployeeProfileContact: () => import('@/components/Employee/EmployeeProfileContact'),
    EmployeeProfileCongratulations: () => import('@/components/Employee/EmployeeProfileCongratulations'),
    EmployeeProfileTesting: () => import('@/components/Employee/EmployeeProfileTesting'),
    EmployeeProfileEducation: () => import('@/components/Employee/EmployeeProfileEducation'),
    EmployeeProfileInfo: () => import('@/components/Employee/EmployeeProfileInfo')
  },
  mixins: [employeeContactsMixin, departmentsFeaturesMixin, documentMetaMixin],
  data: () => ({
    loading: true,
    loadingContacts: true,
    employee: {},
    contactTypes: []
  }),
  async created() {
    await this.fetchEmployeeData()
    await this.fetchContactTypes()
  },
  computed: {
    profileBirthday() {
      return this.moment(this.employee.birthday, 'DD.MM.YYYY').format('DD MMMM')
    },
    departmentColor() {
      return this.getDepartmentColorClassNameByChild(this.employee.division, 'text')
    },
    departmentTitle() {
      return this.getDepartmentInfo(this.employee.division).title
    },
    divisionTitle() {
      const division = this.getDivision()
      if (division) return division.title
      return ''
    },
    hasEducation() {
      if (this.employee.educations) {
        return this.employee.educations.length
      }
      return 0
    },
    fullName() {
      return this.employeeFullName(this.employee)
    }
  },
  methods: {
    async fetchEmployeeData() {
      try {
        this.employee = (await http.get(`employees/${this.$route.params.id}`)).data.data
        this.setPageTitle(this.fullName)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
        this.loadingContacts = false
      }
    },
    async fetchContactTypes() {
      try {
        this.contactTypes = (await http.get(`employees/contact-types`)).data.data
      } catch (error) {
        console.error(error)
      }
    },
    getDivision() {
      let divisionParent = this.employee.division
      if (Object.keys(divisionParent).includes('parent')) {
        let departmentChild
        while (Object.keys(divisionParent).includes('parent')) {
          if (!Object.keys(divisionParent.parent).includes('parent')) {
            departmentChild = divisionParent
          }
          divisionParent = divisionParent.parent
        }
        return departmentChild
      }
      return null
    },
    async onChangeContact() {
      this.loadingContacts = true
      await this.fetchEmployeeData()
      this.loadingContacts = false
    },
    changeAvatar(imagePath) {
      this.employee.photo = imagePath
    }
  }
}
</script>
