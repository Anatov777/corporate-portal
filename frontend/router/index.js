import Vue from 'vue'
import Router from 'vue-router'
import beforeRoute from '@/router/beforeEach.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/pages/Forbidden.vue'),
      meta: {
        noAuth: true,
        emptyLayout: true
      }
    },
    {
      path: '*',
      redirect: '/notfound'
    },
    {
      path: '/notfound',
      name: 'notFound',
      component: () => import('@/pages/NotFound.vue'),
      meta: {
        metaTitle: 'Страница не найдена',
        noAuth: true,
        emptyLayout: true
      }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Home.vue'),
      meta: {
        metaTitle: 'Нейропортал',
        noAuth: true,
        root: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
      meta: {
        metaTitle: 'Вход',
        noAuth: true,
        emptyLayout: false
      }
    },

    {
      path: '/news',
      name: 'News',
      component: () => import('@/pages/News/News.vue'),
      meta: {
        metaTitle: 'Новости',
        noAuth: true
      }
    },
    {
      path: '/news/:year(\\d+)',
      name: 'NewsYear',
      component: () => import('@/pages/News/News.vue'),
      meta: {
        metaTitle: 'Архив новостей и событий',
        noAuth: true
      }
    },
    {
      path: '/news/view/:id',
      name: 'NewsView',
      component: () => import('@/pages/News/NewsView.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: '/news/announce',
      name: 'NewsBillboard',
      component: () => import('@/pages/News/NewsBillboard.vue'),
      meta: {
        noAuth: true
      }
    },

    {
      path: '/employee',
      name: 'Employee',
      component: () => import('@/pages/Employee/EmployeeList.vue'),
      meta: {
        metaTitle: 'Сотрудники',
        noAuth: true
      }
    },
    {
      path: '/search/:id',
      name: 'SearchEmployeePage',
      component: () => import('@/pages/SearchEmployeePage.vue'),
      meta: {
        metaTitle: 'Поиск сотрудника',
        noAuth: true
      }
    },

    {
      path: '/employee/divisions',
      name: 'DepartmentsList',
      component: () => import('@/pages/Employee/DepartmentsList.vue'),
      meta: {
        metaTitle: 'Департаменты и отделы',
        noAuth: true
      }
    },
    {
      path: '/employee/division/:id',
      name: 'DepartmentPage',
      component: () => import('@/pages/Employee/DepartmentPage.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: '/employee/beginners',
      name: 'Beginners',
      component: () => import('@/pages/Employee/EmployeeBeginners.vue'),
      meta: {
        metaTitle: 'Новенькие',
        noAuth: true
      }
    },
    {
      path: '/employee/directory',
      name: 'EmployeeDirectory',
      component: () => import('@/pages/Employee/EmployeeDirectory.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: '/employee/mailgroups',
      name: 'MailGroupsPage',
      component: () => import('@/pages/Employee/MailGroupsPage.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: '/employee/account/:id',
      name: 'Profile',
      component: () => import('@/pages/Employee/EmployeeProfile.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: '/info',
      redirect: '/info/rules'
    },
    {
      path: '/info/hiring',
      name: 'InfoHire',
      component: () => import('@/pages/Info/Hire.vue'),
      meta: {
        metaTitle: 'Подбор сотрудников',
        noAuth: true
      }
    },
    {
      path: '/info/hiring/vacancy/:id',
      name: 'VacancyItem',
      component: () => import('@/pages/Info/VacancyItem.vue'),
      meta: {
        metaTitle: 'Вакансии',
        noAuth: true
      }
    },
    {
      path: '/info/documents',
      name: 'Documents',
      component: () => import('@/pages/Info/Documents.vue'),
      meta: {
        metaTitle: 'Документы',
        noAuth: true
      }
    },
    {
      path: '/info/ideas',
      component: () => import('@/pages/NotFound.vue')
    },
    {
      path: '/info/statistics',
      name: 'Statistics',
      component: () => import('@/pages/Info/Statistics.vue'),
      meta: {
        metaTitle: 'Статистика',
        noAuth: true
      }
    },
    // Роут 'InfoPage' должен быть ниже остальных роутов, которые содержат в начале пути /info
    {
      path: '/info/:pageAlias',
      name: 'InfoPage',
      component: () => import('@/pages/Info/InfoPage.vue'),
      meta: {
        noAuth: true
      },
      children: [
        {
          path: ':tabAlias',
          name: 'InfoPageTab',
          component: () => import('@/components/Info/InfoBlockList.vue')
        }
      ]
    },

    {
      path: '/pages/:alias',
      name: 'TypicalPage',
      component: () => import('@/pages/TypicalPage.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: '/about/honor',
      name: 'HonorBoard',
      component: () => import('@/pages/About/HonorBoard.vue'),
      meta: {
        metaTitle: 'Доска почета',
        noAuth: true
      }
    },
    {
      path: '/about/honor/:id',
      name: 'HonorBoardEmployeePage',
      component: () => import('@/pages/About/HonorBoardEmployeePage.vue'),
      meta: {
        noAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  beforeRoute(to, from, next)
})

export default router
