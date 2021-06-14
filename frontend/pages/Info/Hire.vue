<template>
  <div>
    <page-content-top>
      <div class="d-flex justify-content-between">
        <h2 class="title">
          Подбор сотрудников
        </h2>
        <base-button class="align-self-center" size="lg" rounded="pill" fill="primary">
          Заявка на подбор
        </base-button>
      </div>
    </page-content-top>
    <page-content-main class="hire-content-main">
      <h3 class="hire-vacancy__title">Вакансии</h3>
      <div class="d-flex flex-column">
        <vacancy-card v-for="vacancy in vacancies" :key="vacancy.id" :vacancy="vacancy" />
      </div>
    </page-content-main>
  </div>
</template>

<script>
import 'styles/modules/info/hire.scss'
export default {
  name: 'InfoHire',
  components: {
    VacancyCard: () => import('@/components/Info/VacancyCard'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain')
  },
  data: () => ({
    vacancies: [
      {
        id: '71',
        date: '01.04.2020',
        division: 'Департамент качества и информационных разработок',
        title: 'Руководитель по анализу технологического потенциала активов',
        division_id: '1'
      },
      {
        id: '72',
        date: '01.04.2020',
        title: 'Руководитель по анализу технологического потенциала активов',
        division: 'Департамент качества и информационных разработок',
        division_id: '1'
      },
      {
        id: '73',
        date: '01.04.2020',
        title: 'Руководитель по анализу технологического потенциала активов',
        division: 'Департамент качества и информационных разработок',
        division_id: '1'
      }
    ]
  })
}
</script>
