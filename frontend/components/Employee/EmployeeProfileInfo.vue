<template>
  <div class="bg--grey">
    <div class="container">
      <div class="profile-information">
        <h3 class="profile-section-title">Информация</h3>
        <p v-html="profileDescription"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeProfileInfo',
  props: {
    profileDescription: {
      type: String
    }
  }
}
</script>
