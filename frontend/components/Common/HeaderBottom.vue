<template>
  <div class="header-bottom bg-primary">
    <div class="container">
      <nav class="nav d-flex">
        <div class="d-flex w-100 justify-content-between align-items-center flex-wrap">
          <main-menu />
          <search-employee-form />
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderBottom',
  components: {
    MainMenu: () => import('@/components/Common/MainMenu'),
    SearchEmployeeForm: () => import('@/components/SearchEmployeeForm')
  }
}
</script>
