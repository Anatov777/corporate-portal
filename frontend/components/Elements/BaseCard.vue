<template>
  <div class="base-card d-flex flex-column">
    <base-image
      :image-path="employee.photo"
      :has-lazy-loading="true"
      image-class="base-card-image"
      :imageAlt="employee.full_name"
    />
    <div class="base-card-body d-flex flex-column">
      <div class="base-card-title">
        {{ employee.full_name }}
      </div>
      <p class="base-card-text" v-html="employee.description"></p>
    </div>
    <div class="base-card-bottom">
      <router-link :to="`honor/${employee.id}`">
        <base-button class="base-card-link" outline="dark"> Подробнее </base-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import '@/styles/elements/_base-card.scss'

export default {
  name: 'BaseCard',
  components: {
    BaseImage: () => import('@/components/Elements/BaseImage'),
    BaseButton: () => import('@/components/Elements/BaseButton')
  },
  props: {
    employee: {
      type: Object
    }
  },
  data: () => ({}),
  methods: {}
}
</script>
