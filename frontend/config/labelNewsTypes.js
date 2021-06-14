import postTypes from '@/config/postTypes'

export default {
  [postTypes.TYPE_DEFAULT]: {
    class: 'bg-secondary'
  },
  [postTypes.TYPE_NEWS]: {
    class: 'bg-info'
  },
  [postTypes.TYPE_ALERT]: {
    class: 'bg-danger'
  },
  [postTypes.TYPE_AD]: {
    class: 'bg--teal'
  },
  [postTypes.TYPE_ARTICLE]: {
    class: 'bg-secondary'
  },
  [postTypes.TYPE_EVENT]: {
    class: 'bg-indigo'
  }
}
