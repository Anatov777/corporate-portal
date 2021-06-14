<template>
  <div class="person">
    <div :style="{ 'background-image': `url(${image})` }" class="person-avatar"></div>
    <div class="person-name">
      <router-link :to="employeeLink(employeeId)" class="text-underline-under">
        {{ fullName }}
      </router-link>
    </div>
  </div>
</template>

<script>
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'
import '@/styles/elements/_text.scss'
import '@/styles/modules/avatar-area.scss'

export default {
  name: 'AvatarArea',
  props: {
    image: {
      type: String,
      default: null
    },
    fullName: {
      type: String,
      default: ''
    },
    employeeId: {
      type: Number,
      default: null
    }
  },
  mixins: [employeeContactsMixin]
}
</script>
