<template>
  <div>
    <div class="birthdays-arrows mt-30 position-absolute">
      <span
        :class="{ 'arrow arrow--left': true, 'text-black-50': prevArrowDisabled }"
        role="button"
        @click="prevSlide($event)"
      ></span>
      <span
        :class="{ 'arrow arrow--right': true, 'text-black-50': nextArrowDisabled }"
        role="button"
        @click="nextSlide($event)"
      ></span>
    </div>
    <swiper :options="swiperOption" ref="birthdaysSlider">
      <swiper-slide v-for="(date, index) in birthdayDates" :key="'birthdays-slide-' + index">
        <div class="birthdays-date mt-30 mb-20">
          {{ formattedDate[index] }}<span> ({{ dateToWord[date] }})</span>
        </div>
        <avatar-area
          v-for="(employee, index) in birthdays[date]"
          :key="'person-' + index"
          :image="employee.photo"
          :full-name="`${employee.surname} ${employee.name} ${employee.patronymic}`"
          :employee-id="employee.id"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'
import '@/styles/elements/_text.scss'

export default {
  name: 'BirthdaysBlockSlider',
  props: {
    birthdays: {
      type: Object
    },
    formattedDate: {
      type: Array
    },
    dateToWord: {
      type: Object
    }
  },
  components: {
    AvatarArea: () => import('@/components/Elements/AvatarArea'),
    Swiper,
    SwiperSlide
  },
  mixins: [employeeContactsMixin],
  data() {
    return {
      nextArrowDisabled: false,
      prevArrowDisabled: false
    }
  },
  mounted() {
    this.setDisabledSliderArrow()
  },
  computed: {
    birthdayDates() {
      return Object.keys(this.birthdays).sort()
    },
    swiperSlider() {
      return this.$refs.birthdaysSlider.$swiper
    },
    swiperOption() {
      return {
        initialSlide: this.setInitialSlide()
      }
    }
  },
  methods: {
    nextSlide(event) {
      this.swiperSlider.navigation.onNextClick(event)
      this.prevArrowDisabled = false
      this.setDisabledSliderArrow()
    },
    prevSlide(event) {
      this.swiperSlider.navigation.onPrevClick(event)
      this.nextArrowDisabled = false
      this.setDisabledSliderArrow()
    },
    setInitialSlide() {
      const todayIndex = this.birthdayDates.indexOf(this.moment().format('DD-MM-YYYY'))
      const tomorrowIndex = this.birthdayDates.indexOf(
        this.moment()
          .add(1, 'days')
          .format('DD-MM-YYYY')
      )
      const afterTomorrowIndex = this.birthdayDates.indexOf(
        this.moment()
          .add(2, 'days')
          .format('DD-MM-YYYY')
      )
      const yesterdayIndex = this.birthdayDates.indexOf(
        this.moment()
          .subtract(1, 'days')
          .format('DD-MM-YYYY')
      )
      const beforeYesterdayIndex = this.birthdayDates.indexOf(
        this.moment()
          .subtract(2, 'days')
          .format('DD-MM-YYYY')
      )
      if (todayIndex !== -1) return todayIndex
      else if (tomorrowIndex !== -1) return tomorrowIndex
      else if (afterTomorrowIndex !== -1) return afterTomorrowIndex
      else if (yesterdayIndex !== -1) return yesterdayIndex
      else if (beforeYesterdayIndex !== -1) return beforeYesterdayIndex
      else return 0
    },
    setDisabledSliderArrow() {
      this.swiperSlider.isBeginning ? (this.prevArrowDisabled = true) : ''
      this.swiperSlider.isEnd ? (this.nextArrowDisabled = true) : ''
    }
  }
}
</script>
