<template>
  <div class="absence">
    <div class="absence__content">
      <div class="absence__item">
        <div class="absence__title">Отсутствие</div>
        <div class="d-flex align-items-center absence__date">
          <div>23.03.2020—30.05.2020</div>
          <div class="absence__reason rounded-pill ml-10">больничный</div>
        </div>
        <div class="absence__delete d-flex justify-content-end">Удалить</div>
      </div>
      <div v-if="editIsOpen" class="absence__edit">
        <div class="absence__edit-item">
          <div class="absence__edit-title">Дата</div>
          <flat-pickr
            v-model="date"
            :config="config"
            class="absence__date-picker"
            placeholder="Выберите дату"
          ></flat-pickr>
          <span class="arrow-after"></span>
        </div>
        <div class="absence__edit-item">
          <div class="absence__edit-title">Статус</div>
          <div class="select-status">
            <input
              v-model="selectedStatus"
              class="form-control login-input bg-white"
              type="text"
              readonly
              placeholder="Статус"
              @click="toggleStatusDropdown"
            />
            <span class="arrow-after"></span>
            <div v-if="statusIsOpened" class="select-status__dropdown">
              <div v-for="(status, index) in statuses" :key="`status_${index}`" class="select-status__list">
                <span
                  :style="`background-color: ${statusesColors[index]}`"
                  class="select-status__item"
                  @click="setStatusValue($event)"
                  >{{ status }}</span
                >
                <svg-icon
                  v-if="index === 5"
                  class="profile-edit-icon"
                  name="edit-icon"
                  title="редактировать"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <base-button
      v-if="!editIsOpen"
      size="lg"
      rounded="pill"
      outline="primary"
      fill=""
      @click-btn="toggleEditForm"
    >
      Добавить
    </base-button>
    <base-button v-else size="lg" rounded="pill" fill="primary" @click-btn="toggleEditForm"> ОК </base-button>
  </div>
</template>

<script>
import '@/styles/modules/employee/absence.scss'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import('@/styles/modules/login.scss')

export default {
  name: 'EmployeeProfileAbsence',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    SvgIcon: () => import('@/components/Elements/SvgIcon'),
    flatPickr
  },
  data() {
    return {
      date: null,
      config: {
        altFormat: 'd.m.Y',
        altInput: true,
        mode: 'range',
        locale: Russian
      },
      statusIsOpened: false,
      selectedStatus: null,
      editIsOpen: false
    }
  },
  computed: {
    statuses() {
      const statusesList = [
        'больничный',
        'отпуск',
        'выходной',
        'работа из дома',
        'декрет',
        '09:00-14:00',
        'командировка'
      ]
      return statusesList
    },
    statusesColors() {
      const colors = ['#55d1a4', '#00CBF8', '#4F56FF', '#814BF5', '#C055D1', '#FF7575', '#FFA857']
      return colors
    }
  },
  methods: {
    toggleStatusDropdown() {
      this.statusIsOpened = !this.statusIsOpened
    },
    setStatusValue(event) {
      this.selectedStatus = event.target.innerHTML
      this.toggleStatusDropdown()
    },
    toggleEditForm() {
      this.editIsOpen = !this.editIsOpen
    }
  }
}
</script>
