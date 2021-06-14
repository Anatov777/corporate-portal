<template>
  <div>
    <page-content-top class="vacancy-item-content-top">
      <link-back>
        Вакансии
      </link-back>
    </page-content-top>
    <page-content-main class="pb-100">
      <h2 class="mb-20">Руководитель по анализу технологического потенциала активов</h2>
      <div class="d-flex">
        <span class="vacancy__date">01.04.2020</span>
        <router-link class="vacancy__division" :to="`/employee/division/1`">
          Департамент качества и информационных разработок
        </router-link>
      </div>
      <div class="row justify-content-between vacancy-item-description">
        <div class="col-md-9 mb-md-0 mb-3">
          <div class="vacancy-item-description-item">
            <span class="vacancy-item-description-item-header-title mb-20">
              Обязанности:
            </span>
            <p>
              Модератор процессов с опытом выявления факторов, мешающих повышению бизнес-ценности. Знает
              практики оптимизации затрат при улучшении показателей эффективности бизнеса. Разбирается в
              современных технологиях разработки и добычи УВ. Готов повышать компетенции коллег в своей
              области.
            </p>
          </div>
          <div class="vacancy-item-description-item">
            <span class="vacancy-item-description-item-header-title mb-20">
              Ключевые обязанности:
            </span>
            <p>Формирование перечня гипотез для подтверждения технологического потенциала портфеля</p>
            <p>Ранжирование гипотез с учетом потребностей активов и сценарного анализа</p>
            <p>
              Эффективное взаимодействие с менеджментом Корпоративного центра, дочерних обществ и владельцами
              продукта по уточнению требований, влияющих на ценность портфеля
            </p>
            <p>Взаимодействие с ключевыми партнерами по скаутингу технологий</p>
            <p>Планирование жизненного цикла технологий</p>
          </div>
          <div class="vacancy-item-description-item">
            <span class="vacancy-item-description-item-header-title mb-20">
              Требования:
            </span>
            <p>Наличие опыта в области факторного анализа и/или Value-driven engineering (VDE)</p>
            <p>Сильные навыки организации работ с нуля с учетом требований нескольких заказчиков</p>
            <p>Сильные коммуникационные навыки и критическое мышление</p>
            <p>Умение выстраивать аргументированную позицию перед аудиторией различного уровня</p>
            <p>Навыки выявления факторов и рычагов, влияющих на ценность проекта</p>
            <p>Опыт разработки методологии и технологий риск-менеджмента</p>
            <p>
              Опыт работы в нефтегазовой отрасли в качестве инженерно-технического специалиста желателен, но
              не
            </p>
            обязателен
            <p>
              Уверенное владение английским языком и наличие контактов в научно-технической среде РФ и мира
              будет преимуществом
            </p>
          </div>
          <div class="vacancy-item-description-item">
            <span class="vacancy-item-description-item-header-title mb-20">
              Условия:
            </span>
            <p>Наличие опыта в области факторного анализа и/или Value-driven engineering (VDE)</p>
            <p>Сильные навыки организации работ с нуля с учетом требований нескольких заказчиков</p>
            <p>Сильные коммуникационные навыки и критическое мышление</p>
            <p>Умение выстраивать аргументированную позицию перед аудиторией различного уровня</p>
            <p>Навыки выявления факторов и рычагов, влияющих на ценность проекта</p>
            <p>Опыт разработки методологии и технологий риск-менеджмента</p>
            <p>
              Опыт работы в нефтегазовой отрасли в качестве инженерно-технического специалиста желателен, но
              не обязателен
            </p>
            <p>
              Уверенное владение английским языком и наличие контактов в научно-технической среде РФ и мира
              будет преимуществом
            </p>
          </div>
        </div>
        <div class="col-md-2">
          <div class="vacancy-item-description-item">
            <span class="vacancy-item-description-item-header-title mb-10">
              Тип занятости:
            </span>
            <span>Полный рабочий день</span>
          </div>
          <div class="vacancy-item-description-item">
            <span class="vacancy-item-description-item-header-title mb-10">
              Требуемый опыт:
            </span>
            <span>Более 5 лет</span>
          </div>
        </div>
      </div>
      <base-button size="xl" fill="primary" rounded="pill">Откликнуться</base-button>
    </page-content-main>
  </div>
</template>

<script>
import '@/styles/modules/vacancy.scss'
export default {
  name: 'VacancyItem',
  components: {
    BaseButton: () => import('@/components/Elements/BaseButton'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    LinkBack: () => import('@/components/Elements/LinkBack')
  }
}
</script>
