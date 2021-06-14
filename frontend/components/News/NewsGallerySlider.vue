<template>
  <div class="position-relative swiper-wrap">
    <swiper ref="swiper" class="swiper" :options="swiperOption" @ready="setButtonStyle">
      <swiper-slide v-for="(slide, index) in slides" :key="index" :class="`slide--${index + 1}`">
        <img :src="slide" />
      </swiper-slide>
      <div
        v-show="sliderNavigationIsVisible"
        class="swiper-pagination"
        ref="pagination"
        slot="pagination"
      ></div>
    </swiper>
    <div v-show="sliderNavigationIsVisible" class="navigation">
      <div class="swiper-button-prev swiper-button" :style="buttonStyle" @click="prev"></div>
      <div class="swiper-button-next swiper-button" :style="buttonStyle" @click="next"></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import '@/styles/elements/_slider.scss'

export default {
  name: 'NewsViewGallerySlider',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    slides: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 12,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      buttonStyle: {},
      windowWidth: window.innerWidth
    }
  },
  created() {
    this.setSlidesPerView()
  },
  computed: {
    sliderNavigationIsVisible() {
      return this.slides.length > 3
    }
  },
  methods: {
    prev() {
      this.$refs.swiper.$swiper.slidePrev()
    },
    next() {
      this.$refs.swiper.$swiper.slideNext()
    },
    setButtonStyle() {
      let pagination = this.$refs.pagination
      if (!pagination) return
      this.buttonStyle = {
        top: `calc(50%)`,
        transform: `translate(0, -50%)`
      }
    },
    setSlidesPerView() {
      if (this.windowWidth > 992) this.swiperOption.slidesPerView = 3
      else if (this.windowWidth > 768) this.swiperOption.slidesPerView = 2
      else this.swiperOption.slidesPerView = 1
    }
  }
}
</script>
