import postTypes from '@/config/postTypes'
import eventTypes from '@/config/eventTypes'

export default {
  computed: {
    isEventNews() {
      return this.newsData?.category?.id === postTypes.TYPE_EVENT
    },
    isAnnounceNews() {
      return this.newsData?.category?.id === postTypes.TYPE_AD
    },
    eventImageName() {
      const eventType = this.newsData.event_type.id
      if (eventType === eventTypes.JUBILEE) {
        const [, , startYear] = this.newsData.employee.start_date.split('.')
        const currentYear = moment().year()
        const employeeWorkExperience = moment([currentYear]).diff(moment([+startYear]), 'year')
        return `jubilee-${employeeWorkExperience}.png`
      }
      if (eventType === (eventTypes.SON || eventTypes.DAUGHTER || eventTypes.TWINS)) {
        return `child.png`
      }
      if (eventType === eventTypes.WEDDING) {
        return `wedding.png`
      }
      return `birthday.png`
    }
  }
}
