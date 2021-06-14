<template>
  <div v-if="hasBirthdays()" ref="birthdaysWidget" class="birthdays-widget">
    <div v-if="!birthdaysIsOpen" class="birthdays-widget__icon" @click="toggleBirthdays"></div>
    <div class="birthdays-widget__content scroll-primary" v-else>
      <div class="birthdays-widget__title">
        <h3>Дни рождения</h3>
        <span class="close-btn" role="button" @click="toggleBirthdays"></span>
      </div>
      <birthdays-block-slider
        :birthdays="birthdays"
        :formattedDate="formattedDate"
        :dateToWord="dateToWord"
      ></birthdays-block-slider>
    </div>
  </div>
</template>

<script>
import '@/styles/elements/birthdays.scss'
import '@/styles/elements/_scroll.scss'
import http from '@/modules/http'

export default {
  name: 'BirthdaysBlock',
  components: {
    BirthdaysBlockSlider: () => import('@/components/BirthdaysBlockSlider')
  },
  data: () => ({
    birthdays: {},
    birthdaysIsOpen: false,
    dateToWord: {},
    formattedDate: []
  }),
  async created() {
    this.setBirthdaysListener()
    await this.fetchBirthdays()
    if (typeof this.birthdays !== 'undefined') this.filterBirthdays()
  },
  beforeDestroy() {
    this.removeBirthdaysListener()
  },
  methods: {
    async fetchBirthdays() {
      this.birthdays = (await http.get('/employees/birthdays')).data.data
    },
    toggleBirthdays() {
      this.birthdaysIsOpen = !this.birthdaysIsOpen
    },
    hasBirthdays() {
      if (typeof this.birthdays !== 'undefined') {
        return Object.keys(this.birthdays).length > 0
      } else return 0
    },
    filterBirthdays() {
      const dayWords = ['позавчера', 'вчера', 'сегодня', 'завтра', 'послезавтра']
      const days = Object.keys(this.birthdays).sort()
      const customDateFormat = [
        this.moment()
          .subtract(2, 'days')
          .format('LL')
          .slice(0, -3),
        this.moment()
          .subtract(1, 'days')
          .format('LL')
          .slice(0, -3),
        this.moment()
          .format('LL')
          .slice(0, -3),
        this.moment()
          .add(1, 'days')
          .format('LL')
          .slice(0, -3),
        this.moment()
          .add(2, 'days')
          .format('LL')
          .slice(0, -3)
      ]
      for (let item in this.birthdays) {
        if (this.birthdays[item].length > 0) {
          this.dateToWord[item] = dayWords[days.indexOf(item)]
          this.formattedDate.push(customDateFormat[days.indexOf(item)])
        } else {
          delete this.birthdays[item]
        }
      }
    },
    setBirthdaysListener() {
      document.addEventListener('click', this.eventListenerHandler)
    },
    removeBirthdaysListener() {
      document.removeEventListener('click', this.eventListenerHandler)
    },
    eventListenerHandler(event) {
      if (
        this.birthdaysIsOpen &&
        event.target.closest('.birthdays-widget') !== this.$refs['birthdaysWidget']
      ) {
        this.toggleBirthdays()
      }
    }
  }
}
</script>
