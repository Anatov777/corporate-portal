<template>
  <div>
    <page-content-top>
      <h2>Почтовые группы</h2>
    </page-content-top>
    <loader v-if="isLoading" align="center" class="py-5" />
    <page-content-main v-else class="pb-100">
      <div class="mail-group">
        <div class="mail-group-item">
          <div
            v-for="(generalGroup, index) in simpleMailGroups"
            :key="generalGroup.id"
            :class="`mail-group-header ${generalGroupsColors[index]}`"
          >
            <div class="mail-group-header-title">
              {{ generalGroup.title }}
            </div>
            <div class="mail-group-header-info">
              <div class="mail-group-header-info-description">
                {{ generalGroup.description }}
              </div>
              <div class="mail-group-header-info-email">
                {{ generalGroup.email }}
              </div>
            </div>
          </div>
        </div>
        <mail-groups-item v-for="group in basicMailGroups" :key="group.id" :mail-group="group" />
      </div>
    </page-content-main>
  </div>
</template>

<script>
import http from '@/modules/http'
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'

export default {
  name: 'MailGroupsPage',
  components: {
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    Loader: () => import('@/components/Elements/Loader'),
    MailGroupsItem: () => import('@/components/Employee/MailGroupsItem')
  },
  mixins: [departmentsFeaturesMixin],
  data: () => ({
    mailGroups: {},
    isLoading: false,
    generalGroupsColors: [
      'bg-primary-blue',
      'bg-primary-purple-link',
      'bg-primary-light-red',
      'bg-primary-dark-gray'
    ]
  }),
  async created() {
    await this.fetchMailGroups()
  },
  computed: {
    basicMailGroups() {
      return this.mailGroups.filter(item => {
        return ![10, 11, 12].includes(item.id)
      })
    },
    simpleMailGroups() {
      return this.mailGroups.filter(item => {
        return [10, 11, 12].includes(item.id)
      })
    }
  },
  methods: {
    async fetchMailGroups() {
      this.isLoading = true
      await http
        .get('/mail-groups')
        .then(response => {
          this.mailGroups = response.data.data
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
