export default {
  methods: {
    getDepartmentColorClassName(departmentId, className) {
      switch (departmentId) {
        case 2:
          return `${className}-blue`
        case 28:
          return `${className}-light-blue`
        case 1:
          return `${className}-orange`
        case 18:
          return `${className}-success`
        case 6:
        case 78:
          return `${className}-turquoise`
        case 4:
          return `${className}-info`
        case 3:
          return `${className}-purple-link`
        case 5:
          return `${className}-light-purple`
        case 7:
          return `${className}-purple-pink`
        case 8:
          return `${className}-light-red`
        default:
          return `${className}-dark-gray`
      }
    },
    getDepartmentInfo(divisionInfo) {
      while (Object.keys(divisionInfo).includes('parent')) {
        divisionInfo = divisionInfo.parent
      }
      return divisionInfo
    },
    getDepartmentColorClassNameByChild(divisionInfo, className) {
      let departmentId = this.getDepartmentInfo(divisionInfo).id
      return this.getDepartmentColorClassName(departmentId, className)
    }
  }
}
