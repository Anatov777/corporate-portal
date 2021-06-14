<template>
  <div>
    <page-content-top class="py-30 bg--light-purple">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h2 class="text-white">
            Доска почета
          </h2>
        </div>
        <div>
          <base-button
            v-if="hasEditingRights"
            rounded="pill"
            fill="white"
            size="lg"
            @click-btn="toggleAddEmployeeModal"
          >
            Добавить сотрудника
          </base-button>
        </div>
      </div>
    </page-content-top>
    <page-content-main class="honor-board-main">
      <honor-board-medal class="mb-100" />
      <loader v-if="isLoadingEmployees" align="center" class="py-5" />
      <honor-board-employee-list v-else :employees="honorBoardEmployees" />
      <base-modal
        v-if="isOpenAddEmployeeModal"
        :is-show="isOpenAddEmployeeModal"
        :hasFooter="false"
        mode="custom"
        @close="toggleAddEmployeeModal"
      >
        <template slot="header">
          Добавление сотрудника к доске почета
        </template>
        <template slot="body">
          <honor-board-edit-form
            :employees.sync="employees"
            :honor-board-employees.sync="honorBoardEmployees"
            @close-modal="toggleAddEmployeeModal"
          />
        </template>
      </base-modal>
    </page-content-main>
  </div>
</template>

<script>
import '@/styles/modules/about/honor-board.scss'
import http from '@/modules/http'
import { mapGetters } from 'vuex'

export default {
  name: 'HonorBoard',
  components: {
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    Loader: () => import('@/components/Elements/Loader'),
    HonorBoardEditForm: () => import('@/components/About/HonorBoardEditForm'),
    HonorBoardMedal: () => import('@/components/About/HonorBoardMedal'),
    HonorBoardEmployeeList: () => import('@/components/About/HonorBoardEmployeeList')
  },
  data: () => ({
    isOpenAddEmployeeModal: false,
    isLoadingEmployees: false,
    employees: [],
    honorBoardEmployees: []
  }),
  async created() {
    await this.fetchHonorBoardEmployees()
  },
  computed: {
    hasEditingRights() {
      return this.HAS_RIGHTS()(['employee.manage'])
    }
  },
  methods: {
    ...mapGetters(['HAS_RIGHTS']),
    toggleAddEmployeeModal() {
      this.isOpenAddEmployeeModal = !this.isOpenAddEmployeeModal
    },
    async fetchHonorBoardEmployees() {
      this.isLoadingEmployees = true
      await http
        .get('/employees/hall-of-fame')
        .then(response => {
          this.honorBoardEmployees = response.data.data
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoadingEmployees = false
        })
    }
  }
}
</script>
