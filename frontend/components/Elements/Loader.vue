<template>
  <div :class="[this.align ? `text-${this.align}` : '']">
    <div :class="loaderClasses()" role="status"></div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      validator(size) {
        return size === 'sm'
      }
    },
    color: {
      type: String,
      default: 'primary'
    },
    align: {
      type: String
    },
    type: {
      type: String,
      default: 'border',
      validator(type) {
        return ['border', 'grow'].indexOf(type) !== -1
      }
    }
  },
  name: 'Loader',
  data: () => ({}),
  computed: {},
  methods: {
    loaderClasses() {
      return [
        `spinner-${this.type}`,
        this.size ? `spinner-${this.type}-${this.size}` : '',
        `text-${this.color}`
      ]
    }
  }
}
</script>
