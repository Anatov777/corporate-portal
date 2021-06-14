<template>
  <div>
    <template v-if="!isBackgroundImage">
      <img
        v-if="hasLazyLoading"
        v-lazyload
        :data-src="imagePath"
        :class="`${imageClass} preloader`"
        :alt="imageAlt"
        @error="setDefaultImage($event)"
      />
      <img v-else :src="imagePath" :class="imageClass" :alt="imageAlt" @error="setDefaultImage($event)" />
    </template>

    <template v-else>
      <div
        v-if="imagePath"
        :style="{ 'background-image': `url(${imagePath})` }"
        class="person-avatar person-avatar_big"
      ></div>
      <div
        v-else
        :style="{ 'background-image': `url(${defaultImagePath})` }"
        class="person-avatar person-avatar_big"
      ></div>
    </template>
  </div>
</template>

<script>
import lazyload from '@/directives/lazyload'
import '@/styles/elements/_preloader.scss'
import '@/styles/modules/avatar-area.scss'

export default {
  name: 'BaseImage',
  props: {
    imagePath: {
      type: String,
      default: null
    },
    imageClass: {
      type: String,
      default: null
    },
    hasLazyLoading: {
      type: Boolean,
      default: false
    },
    imageAlt: {
      type: String,
      default: null
    },
    isBackgroundImage: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    lazyload
  },
  computed: {
    defaultImagePath() {
      return require('@/assets/not-found.png')
    }
  },
  methods: {
    setDefaultImage(event) {
      event.target.src = this.defaultImagePath
    }
  }
}
</script>
