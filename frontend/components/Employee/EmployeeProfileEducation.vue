<template>
  <div>
    <h3 class="profile-section-title">Образование</h3>
    <div class="profile-education__content">
      <div
        v-for="education in employeeEducations"
        :key="education.id"
        class="profile-table profile-education__item"
      >
        <div class="profile-table__row">
          <div class="profile-table__header">Учебное заведение</div>
          <div class="profile-table__column">{{ education.institution }}</div>
        </div>
        <div class="profile-table__row">
          <div class="profile-table__header">Специальность</div>
          <div class="profile-table__column">{{ education.speciality }}</div>
        </div>
        <div class="profile-table__row">
          <div class="profile-table__header">Год окончания</div>
          <div class="profile-table__column">{{ education.year }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeProfileEducation',
  props: {
    employeeEducations: {
      type: Array
    }
  }
}
</script>
