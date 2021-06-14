<template>
  <div>
    <page-content-top class="py-30 bg--light-purple">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <link-back class="text-white">
            Доска почета
          </link-back>
        </div>
        <div>
          <base-button
            v-if="hasEditingRights"
            rounded="pill"
            fill="white"
            size="lg"
            @click-btn="toggleAddEmployeeModal"
          >
            Редактировать
          </base-button>
        </div>
      </div>
    </page-content-top>
    <page-content-main class="honor-board-main">
      <loader v-if="isLoadingEmployees" align="center" class="py-5" />
      <div v-else class="medal">
        <base-image
          :image-path="employeeData.photo"
          :imageAlt="employeeData.full_name"
          class="medal-image medal-image-photo"
        />
        <div class="medal-text">
          <h3>{{ employeeData.full_name }}</h3>
          <div class="medal-text-date">Год получения ордена: {{ employeeData.year }}</div>
          <div class="medal-text-description-secondary" v-html="employeeData.description"></div>
        </div>
      </div>

      <base-modal
        v-if="isOpenAddEmployeeModal"
        :is-show="isOpenAddEmployeeModal"
        :hasFooter="false"
        mode="custom"
        @close="toggleAddEmployeeModal"
      >
        <template slot="header">
          Редактирование элемента доски почета
        </template>
        <template slot="body">
          <honor-board-edit-form
            :employees.sync="employees"
            :honor-board-employees.sync="honorBoardEmployees"
            :employee-data.sync="employeeData"
            mode="edit"
            @close-modal="toggleAddEmployeeModal"
          />
        </template>
      </base-modal>
    </page-content-main>
  </div>
</template>

<script>
import documentMetaMixin from '@/mixins/documentMeta.mixin'
import '@/styles/modules/about/honor-board.scss'
import '@/styles/modules/about/honor-board-medal.scss'
import http from '@/modules/http'
import { mapGetters } from 'vuex'

export default {
  name: 'HonorBoardEmployeePage',
  components: {
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    BaseImage: () => import('@/components/Elements/BaseImage'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    HonorBoardEditForm: () => import('@/components/About/HonorBoardEditForm'),
    Loader: () => import('@/components/Elements/Loader'),
    LinkBack: () => import('@/components/Elements/LinkBack')
  },
  mixins: [documentMetaMixin],
  data: () => ({
    employees: [],
    honorBoardEmployees: [],
    employeeData: [],
    isLoadingEmployees: false,
    isOpenAddEmployeeModal: false
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
    async fetchHonorBoardEmployees() {
      this.isLoadingEmployees = true
      await http
        .get('/employees/hall-of-fame')
        .then(response => {
          this.honorBoardEmployees = response.data.data
          this.setEmployeeData()
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoadingEmployees = false
        })
    },
    setEmployeeData() {
      this.employeeData = this.honorBoardEmployees.find(person => person.id === +this.$route.params.id)
      this.setPageTitle(this.employeeData.full_name)
    },
    toggleAddEmployeeModal() {
      this.isOpenAddEmployeeModal = !this.isOpenAddEmployeeModal
    }
  }
}
</script>
