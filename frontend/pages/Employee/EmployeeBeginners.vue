<template>
  <div>
    <page-content-top class="info-tab-top">
      <h2 class="mb-3">Новенькие</h2>
      <tabs
        class="mt-auto"
        :class="{ 'tab-disabled': disableTabs }"
        :tabs="infoTabs"
        @changeTab="changeTab($event)"
        tabClass="info-tab-top-item"
        :activeTab="activeTab"
      />
    </page-content-top>
    <page-content-main class="pb-100">
      <loader v-show="loading" class="py-5" align="center" />
      <h3 v-if="emptyBeginners">За данный период нет новеньких</h3>
      <employee-beginners-item v-else :beginners-filtered="employeesFiltered" />
    </page-content-main>
  </div>
</template>

<script>
import '@/styles/modules/info/info-tab-top.scss'
import http from '@/modules/http'

export default {
  name: 'EmployeeBeginners',
  components: {
    Tabs: () => import('@/components/Elements/Tabs'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    EmployeeBeginnersItem: () => import('@/components/Employee/EmployeeBeginnersItem'),
    Loader: () => import('@/components/Elements/Loader')
  },
  data: () => ({
    infoTabs: [
      {
        title: 'За последний месяц',
        value: 'filterByOneMonth'
      },
      {
        title: 'За 3 месяца',
        value: 'filterByThreeMonth'
      },
      {
        title: 'За 6 месяцев',
        value: 'filterBySixMonth'
      }
    ],
    activeTab: '',
    disableTabs: true,
    employeesFiltered: null,
    employees: null,
    employeesFilteredBySixMonth: null,
    employeesFilteredByThreeMonth: null,
    employeesFilteredByOneMonth: null,
    loading: true,
    emptyBeginners: false
  }),
  async created() {
    this.setActiveTab()
    await this.setInitialFilter()
  },
  methods: {
    changeTab(tabName) {
      this.setEmployeesFilter(tabName)
    },
    setActiveTab() {
      let tabsValues = this.infoTabs.map(tab => tab.value)
      let routePathSplitted = this.$route.path.split('/')
      let lastPath = routePathSplitted[routePathSplitted.length - 1]
      if (tabsValues.includes(lastPath)) {
        this.activeTab = lastPath
      }
    },
    async setInitialFilter() {
      try {
        this.employeesFilteredByOneMonth = await this.fetchBeginners(1)
        this.employeesFiltered = this.employeesFilteredByOneMonth
        this.setEmptyBeginners(this.employeesFiltered)
        this.disableTabs = false
      } catch (error) {
        console.error('Error', error)
      } finally {
        this.loading = false
      }
    },
    async setEmployeesFilter(filterName) {
      switch (filterName) {
        case 'filterByThreeMonth':
          if (!this.employeesFilteredByThreeMonth) {
            this.employeesFilteredByThreeMonth = await this.fetchBeginners(3)
          }
          this.setFilteredBeginners(this.employeesFilteredByThreeMonth)
          break
        case 'filterBySixMonth':
          if (!this.employeesFilteredBySixMonth) {
            this.employeesFilteredBySixMonth = await this.fetchBeginners(6)
          }
          this.setFilteredBeginners(this.employeesFilteredBySixMonth)
          break
        default:
          this.setFilteredBeginners(this.employeesFilteredByOneMonth, 1)
      }
    },
    setEmptyBeginners(persons) {
      if (persons) {
        persons.length ? (this.emptyBeginners = false) : (this.emptyBeginners = true)
      }
    },
    async fetchBeginners(filterPeriod) {
      return (await http.get('/employees', { params: { period: filterPeriod } })).data.data
    },
    async setFilteredBeginners(filterValue) {
      this.employeesFiltered = filterValue
      this.setEmptyBeginners(this.employeesFiltered)
    }
  }
}
</script>
