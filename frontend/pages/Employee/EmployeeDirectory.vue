<template>
  <div>
    <page-content-top>
      <h2>
        Справочник по алфавиту
      </h2>
    </page-content-top>
    <page-content-main class="directory-content-main">
      <loader v-if="loading" class="py-5" align="center" />
      <div v-else class="table-responsive">
        <table class="table table-bordered directory-table">
          <thead class="text-center directory-table-header">
            <tr class="text-uppercase">
              <th class="directory-column-letter" rowspan="2"></th>
              <th class="directory-column-name" rowspan="2">ФИО</th>
              <th class="directory-column-email" rowspan="2">E-mail</th>
              <th class="directory-column-phone" colspan="3">Телефоны</th>
              <th class="directory-column-room" rowspan="2">Комната</th>
            </tr>
            <tr>
              <th class="directory-column-phone-item">Рабочий</th>
              <th class="directory-column-phone-item">Мобильный</th>
              <th class="directory-column-phone-item">Домашний</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(employee, index) in employees" :key="employee.id">
              <td
                v-if="index === 0 || employees[index].letter !== employees[index - 1].letter"
                :rowspan="employee.letterAmount"
                class="text-center text-uppercase directory-column-letter-data"
              >
                {{ employee.letter }}
              </td>
              <td class="directory-column-name-data">
                <router-link :to="employeeLink(employee.id)">
                  {{ employeeFullName(employee) }}
                </router-link>
              </td>
              <td class="directory-column-email-data">
                <span v-if="isContactExists(employee.contacts, employeeContactTypes.EMAIL_JOB)">
                  <a
                    :href="`mailto:${contact}`"
                    v-for="({ contact }, indexContact) in contactTypeValues(
                      employee.contacts,
                      employeeContactTypes.EMAIL_JOB
                    )"
                    :key="indexContact"
                  >
                    {{ contact }}
                  </a>
                </span>
              </td>
              <td>
                <span
                  class="d-flex flex-wrap justify-content-center"
                  v-if="isContactExists(employee.contacts, employeeContactTypes.PHONE_JOB)"
                >
                  <span
                    class="rounded-pill bg-primary text-white directory-phone-label"
                    v-for="({ contact }, indexContact) in contactTypeValues(
                      employee.contacts,
                      employeeContactTypes.PHONE_JOB
                    )"
                    :key="indexContact"
                  >
                    {{ contact }}
                  </span>
                </span>
              </td>
              <td class="text-center">
                <span
                  class="d-flex flex-wrap justify-content-center"
                  v-if="isContactExists(employee.contacts, employeeContactTypes.PHONE_MOBILE)"
                >
                  <span
                    class="rounded-pill bg-primary text-white directory-phone-label"
                    v-for="({ contact }, indexContact) in contactTypeValues(
                      employee.contacts,
                      employeeContactTypes.PHONE_MOBILE
                    )"
                    :key="indexContact"
                    v-html="contact"
                  >
                  </span>
                </span>
              </td>
              <td class="text-center">
                <span
                  class="d-flex flex-wrap justify-content-center"
                  v-if="isContactExists(employee.contacts, employeeContactTypes.PHONE_HOME)"
                >
                  <span
                    class="rounded-pill bg-primary text-white directory-phone-label"
                    v-for="({ contact }, indexContact) in contactTypeValues(
                      employee.contacts,
                      employeeContactTypes.PHONE_HOME
                    )"
                    :key="indexContact"
                    v-html="contact"
                  >
                  </span>
                </span>
              </td>
              <td class="text-center">
                {{ employee.room }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </page-content-main>
  </div>
</template>

<script>
import '@/styles/modules/employee/directory.scss'
import http from '@/modules/http'
import employeeContactsMixin from '@/mixins/employeeContacts.mixin'
export default {
  mixins: [employeeContactsMixin],
  name: 'Directory',
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    PageContentTop: () => import('@/components/Common/PageContentTop')
  },
  data: () => ({
    loading: true,
    employees: []
    /*employees: [
      {
        letter: 'A',
        employees: [
          {
            id: 425,
            surname: 'Абрашкина',
            name: 'Надежда',
            patronymic: 'Андреевна',
            maidenSurname: null,
            division: 'Отдел информационных технологий',
            position: 'Ведущий программист',
            room: '302',
            initialImage: '/files/employee/employee/abrashkina_425/Abrashkina.jpg',
            photo: '/files/employee/employee/abrashkina_425/Abrashkina_preview.jpg',
            contacts: {
              5: '309',
              1: 'nadine@neurosoft.ru',
              7: '+7 (4932) 48-25-69',
              6: '+7 (906) 510-55-00'
            },
            status: 1,
            ifDirector: false,
            vacation: null
          },
          {
            id: 113,
            surname: 'Агуренко',
            name: 'Людмила',
            patronymic: 'Михайловна',
            maidenSurname: null,
            division: 'Административно-хозяйственный отдел',
            position: 'Уборщик помещений',
            room: '106',
            initialImage: '/files/employee/employee/agurenko_113/Agurenko.jpg',
            photo: '/files/employee/employee/agurenko_113/Agurenko_preview.jpg',
            contacts: {
              5: '156 116',
              1: 'nadine@neurosoft.ru',
              7: '+7 (4932) 48-25-69',
              6: '+7 (906) 510-55-00'
            },
            status: 1,
            ifDirector: false,
            vacation: null
          }
        ],
        count: 2
      },
      {
        letter: 'Б',
        employees: [
          {
            id: 425,
            surname: 'Абрашкина',
            name: 'Надежда',
            patronymic: 'Андреевна',
            maidenSurname: null,
            division: 'Отдел информационных технологий',
            position: 'Ведущий программист',
            room: '302',
            initialImage: '/files/employee/employee/abrashkina_425/Abrashkina.jpg',
            photo: '/files/employee/employee/abrashkina_425/Abrashkina_preview.jpg',
            contacts: {
              5: '156 116',
              1: 'nadine@neurosoft.ru',
              7: '+7 (4932) 48-25-69',
              6: '+7 (906) 510-55-00'
            },
            status: 1,
            ifDirector: false,
            vacation: null
          },
          {
            id: 113,
            surname: 'Агуренко',
            name: 'Людмила',
            patronymic: 'Михайловна',
            maidenSurname: null,
            division: 'Административно-хозяйственный отдел',
            position: 'Уборщик помещений',
            room: '106',
            initialImage: '/files/employee/employee/agurenko_113/Agurenko.jpg',
            photo: '/files/employee/employee/agurenko_113/Agurenko_preview.jpg',
            contacts: {
              5: '309',
              1: 'nadine@neurosoft.ru',
              7: '+7 (4932) 48-25-69',
              6: '+7 (906) 510-55-00'
            },
            status: 1,
            ifDirector: false,
            vacation: null
          }
        ],
        count: 2
      }
    ]*/
  }),
  async created() {
    try {
      this.employees = (await http.get('/employees/phonebook')).data.data
    } catch (e) {
      console.error('e', e)
    } finally {
      this.loading = false
    }
  }
}
</script>
