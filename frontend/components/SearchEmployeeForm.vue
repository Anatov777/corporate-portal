<template>
  <form class="header-bottom__search-form search" @submit.prevent="submitForm">
    <input
      v-model="searchValue"
      class="search-input"
      type="search"
      placeholder="Поиск сотрудника"
      aria-label="Search"
    />
    <button class="btn search-btn" type="submit">
      <svg-icon name="search" class="search-icon" />
    </button>
  </form>
</template>

<script>
import http from '@/modules/http'
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'

export default {
  name: 'SearchEmployeeForm',
  components: {
    SvgIcon: () => import('@/components/Elements/SvgIcon')
  },
  mixins: [employeeContactsMixin],
  data() {
    return {
      searchValue: '',
      searchId: 0
    }
  },
  watch: {
    '$route.name'(name) {
      if (name !== 'SearchEmployeePage') this.searchValue = ''
    }
  },
  methods: {
    async submitForm() {
      if (this.searchValue) await this.searchEmployees()
    },
    async searchEmployees() {
      const responseSearchResult = (
        await http.post(`/employees/search`, {
          searchString: this.searchValue
        })
      )?.data?.data
      this.searchId++
      this.toSearchResultPage(responseSearchResult)
    },
    toSearchResultPage(searchResult) {
      if (searchResult?.length === 1) {
        this.$router.push({ path: this.employeeLink(searchResult[0].id) }).catch(() => {})
      } else {
        this.$router
          .push({
            name: 'SearchEmployeePage',
            params: { searchEmployeeResult: searchResult, id: this.searchId }
          })
          .catch(() => {})
      }
    }
  }
}
</script>
