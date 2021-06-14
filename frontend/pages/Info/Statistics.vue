<template>
  <div>
    <page-content-top class="info-tab-top">
      <h2 class="mb-3">В настоящий момент в Нейрософте</h2>
    </page-content-top>
    <page-content-main class="pb-100">
      <loader v-if="statisticsLoading" align="center" class="py-5" />
      <statistics-chart v-show="!statisticsLoading" :statisticsData="statisticsData" />
    </page-content-main>
  </div>
</template>

<script>
import '@/styles/modules/info/info-tab-top.scss'
import '@/styles/modules/info/statistics.scss'
import http from '@/modules/http'

export default {
  components: {
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    StatisticsChart: () => import('@/components/StatisticsChart'),
    Loader: () => import('@/components/Elements/Loader')
  },
  name: 'Statistics',
  data: () => ({
    statisticsData: {},
    statisticsLoading: true
  }),
  async created() {
    await this.fetchStatistics()
  },
  methods: {
    async fetchStatistics() {
      this.statisticsData = (await http.get('/employees/statistics')).data.data
      this.statisticsLoading = false
    }
  }
}
</script>
