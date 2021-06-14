<template>
  <div class="department-list">
    <div class="department-name">
      <router-link ref="departmentLink" class="department-name__title" :to="`division/${departmentData.id}`">
        <span ref="departmentArrow" class="arrow arrow--right" :style="`left: ${arrowPosition}px`"></span>
        <span>{{ departmentData.title }}</span>
      </router-link>
      <div class="department-director">
        <div class="department-director__title">Директор</div>
        <div
          class="department-director__photo"
          :style="{ 'background-image': `url(${departmentData.director.photo})` }"
        ></div>
      </div>
    </div>
    <div class="departments">
      <department-dropdown
        v-for="departmentItem in departmentData.children"
        :key="departmentItem.id"
        :ref="`division_${departmentItem.id}`"
        :class="[
          'departments__item',
          { 'arrow-after': hasChildren(departmentItem.children) },
          `${getDepartmentColorClassNameByChild(departmentData, 'bg-primary')}`
        ]"
        :department-data="departmentItem"
        :department-id="departmentData.id"
      />
    </div>
  </div>
</template>

<script>
import departmentsFeaturesMixin from '@/mixins/departmentsFeatures.mixin'

export default {
  name: 'DepartmentsListElement',
  components: {
    DepartmentDropdown: () => import('@/components/Employee/DepartmentDropdown')
  },
  mixins: [departmentsFeaturesMixin],
  props: {
    departmentData: Object
  },
  data: () => ({
    arrowPosition: 0
  }),
  mounted() {
    this.setArrowPosition()
  },
  methods: {
    hasChildren(children) {
      if (children) {
        return children.length > 0
      }
      return 0
    },
    setArrowPosition() {
      if (this.$refs.departmentLink) {
        let elementWidth = this.$refs['departmentLink'].$el.offsetWidth
        this.arrowPosition = elementWidth + 15
      }
      return 0
    }
  }
}
</script>
