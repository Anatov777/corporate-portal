import contactTypes from '@/config/contactTypes'

export default {
  computed: {
    employeeContactTypes() {
      return contactTypes
    }
  },
  methods: {
    isContactExists(employeeContacts, contactType) {
      return employeeContacts.some(contact => contact.typeId === contactType)
    },
    employeeFullName(employee) {
      return `${employee.surname} ${employee.name} ${employee.patronymic}`
    },
    employeeLink(id) {
      return `/employee/account/${id}`
    },
    contactTypeValues(employeeContacts, contactType) {
      return employeeContacts.find(contact => contact.typeId === contactType).values
    },
    runLoader() {
      this.isUpdatingContacts = true
    }
  }
}
