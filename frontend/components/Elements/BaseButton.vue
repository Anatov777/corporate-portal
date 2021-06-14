<template>
  <router-link v-if="link" :to="link" class="btn" :class="cssClasses" @click="$emit('click-btn', $event)">
    <slot />
  </router-link>
  <button
    v-else
    class="btn"
    :class="cssClasses"
    :type="type"
    :disabled="disabled"
    @click="$emit('click-btn', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    rounded: {
      type: String,
      default: ''
    },
    outline: {
      type: String,
      default: ''
    },
    fill: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'button'
    },
    size: {
      type: String,
      validator(size) {
        return ['sm', 'lg', 'xl'].indexOf(size) !== -1
      }
    },
    link: {
      type: String
    },
    disabled: {
      type: Boolean
    }
  },
  name: 'BaseButton',
  computed: {
    cssClasses() {
      return [
        this.outline ? `btn-outline-${this.outline}` : '',
        this.rounded ? `rounded-${this.rounded}` : '',
        this.fill ? `bg-${this.fill} ${this.fill !== 'white' ? 'text-white' : ''}` : '',
        this.size ? `btn--${this.size}` : ''
      ]
    }
  }
}
</script>
