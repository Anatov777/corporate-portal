<template>
  <div class="vacancy-card">
    <span class="vacancy-card__title">
      <router-link :to="`${this.$route.path}/vacancy/${vacancy.id}`">
        {{ vacancy.title }}
      </router-link>
    </span>
    <div class="d-flex">
      <span class="vacancy-card__date vacancy__date">{{ vacancy.date }}</span>
      <router-link
        class="vacancy-card__division vacancy__division"
        :to="`/employee/division/${vacancy.division_id}`"
      >
        {{ vacancy.division }}
      </router-link>
    </div>
  </div>
</template>

<script>
import '@/styles/elements/_vacancy-card.scss'
export default {
  props: {
    vacancy: {
      type: Object,
      required: true
    }
  },
  name: 'VacancyCard'
}
</script>
