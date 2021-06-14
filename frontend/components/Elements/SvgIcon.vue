<template>
  <svg
    :class="[className, { 'effect-hover': hasHover }]"
    xmlns="http://www.w3.org/2000/svg"
    @click="$emit('click-icon', $event)"
  >
    <title v-if="title">{{ title }}</title>
    <use :xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: null
    },
    hasHover: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconPath() {
      let icon = require(`@/assets/icon/${this.name}.svg`)
      if (Object.prototype.hasOwnProperty.call(icon, 'default')) {
        icon = icon.default
      }
      return icon.url
    },
    className() {
      return 'svg-icon svg-icon--' + this.name
    }
  }
}
</script>
