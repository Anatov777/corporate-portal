<template>
  <div>
    <page-content-top class="pt-0 d-flex">
      <div class="d-flex align-items-center justify-content-between h-100">
        <link-back>
          {{ newsData.title }}
        </link-back>
        <div class="d-flex flex-wrap flex-gap-10">
          <base-button
            v-if="canEdit"
            size="lg"
            fill="primary"
            rounded="pill"
            class="d-flex justify-content-center align-items-center"
            @click-btn="toggleEditNewsModal"
          >
            <span v-if="isAnnounceNews">Редактировать объявление</span>
            <span v-else>Редактировать новость</span>
          </base-button>
        </div>
      </div>
    </page-content-top>
    <page-content-main class="pt-0 news-item-content-main mb-100">
      <loader v-if="loading" align="center" class="py-5" />
      <div v-else>
        <div class="post__info">
          <router-link
            v-if="newsData.author && newsData.author.employee"
            :to="`/employee/account/${newsData.author.employee.id}`"
            class="post__author"
          >
            {{ author }}
          </router-link>
          <span>
            {{ filteredDate }}
          </span>
        </div>
        <div class="row post-body">
          <div class="col-md-8">
            <div class="post-body-persons">
              <avatar-area
                v-for="employee in newsData.employees"
                :key="employee.id"
                :image="employee.photo"
                :full-name="`${employee.surname} ${employee.name} ${employee.patronymic}`"
                :employee-id="employee.id"
              />
            </div>
            <div class="post-text editor-content" v-html="newsData.text" />
          </div>
          <div class="col-md-4 post-body-image">
            <base-image
              v-if="newsData.image || newsData.employee"
              :image-path="newsData.image || newsData.employee.photo"
              :imageAlt="newsData.title_preview"
              class="post__image"
            />
            <base-image
              v-else-if="isEventNews"
              :image-path="require(`@/assets/event/${eventImageName}`)"
              :imageAlt="newsData.title_preview"
              class="post-image-event bg-indigo"
            />
          </div>
        </div>
        <h4 class="title mb-5" v-if="hasGalleryImages || hasFiles">
          Прикрепленные файлы
        </h4>

        <loader v-if="loadingGallery" align="center" class="py-5" />
        <news-gallery
          v-else
          :has-gallery-images="hasGalleryImages"
          :gallery-images.sync="galleryImages"
          :has-edit-button="isShowEditGalleryButton"
          ref="gallery"
        />

        <template v-if="filesAreaIsVisible">
          <loader v-if="loadingFiles" align="center" class="py-5" />
          <news-files
            v-else
            :has-files="hasFiles"
            :attached-files.sync="attachedFiles"
            :has-edit-button="isShowEditFilesButton"
            ref="files"
          />
        </template>

        <base-modal
          v-if="isOpenEditNewsModal"
          :is-show="isOpenEditNewsModal"
          :hasFooter="false"
          size="medium"
          mode="custom"
          @close="toggleEditNewsModal"
        >
          <template slot="header">
            <span v-if="isAnnounceNews">Редактирование объявления</span>
            <span v-else>Редактирование новости/события</span>
          </template>
          <template slot="body">
            <news-edit-form
              :news.sync="newsData"
              mode="edit"
              :news-types.sync="newsTypes"
              :event-types.sync="eventTypes"
              :employees.sync="employees"
              @close-modal="toggleEditNewsModal"
            />
          </template>
        </base-modal>
      </div>
    </page-content-main>
    <news-comments :hasForm="HAVE_AUTH_USER" id="comments" ref="comments" />

    <news-latest :news-id="newsId" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import http from '@/modules/http'
import '@/styles/modules/news-item.scss'
import '@/styles/elements/_gaps.scss'
import '@/styles/elements/_tiptap-text-editor.scss'
import newsFilter from '@/filters/news.filter'
import documentMetaMixin from '@/mixins/documentMeta.mixin'
import scrollToAnchor from '@/mixins/scrollToAnchor.mixin'
import newsMixin from '@/mixins/news.mixin'

export default {
  name: 'NewsView',
  components: {
    Loader: () => import('@/components/Elements/Loader'),
    NewsGallery: () => import('@/components/News/NewsGallery'),
    NewsFiles: () => import('@/components/News/NewsFiles'),
    NewsComments: () => import('@/components/News/NewsComments'),
    NewsLatest: () => import('@/components/News/NewsLatest'),
    BaseButton: () => import('@/components/Elements/BaseButton'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain'),
    BaseModal: () => import('@/components/Elements/BaseModal'),
    NewsEditForm: () => import('@/components/News/NewsEditForm'),
    LinkBack: () => import('@/components/Elements/LinkBack'),
    BaseImage: () => import('@/components/Elements/BaseImage'),
    AvatarArea: () => import('@/components/Elements/AvatarArea')
  },
  mixins: [documentMetaMixin, newsMixin, scrollToAnchor],
  data() {
    return {
      newsData: {},
      loading: true,
      loadingGallery: true,
      loadingFiles: true,
      galleryImages: [],
      attachedFiles: [],
      isOpenEditNewsModal: false,
      newsTypes: [],
      eventTypes: [],
      employees: [],
      isLoadedChildComponents: false
    }
  },
  async created() {
    await this.fetchNews()
    await this.fetchGalleryImages()
    await this.fetchFiles()
  },
  updated() {
    this.$nextTick(() => {
      if (!this.isLoadedChildComponents) {
        this.scrollToAnchor()
      }
      if (this.$refs.comments && this.$refs.gallery && this.$refs.files) {
        this.isLoadedChildComponents = true
      }
    })
  },
  computed: {
    ...mapGetters(['HAVE_AUTH_USER', 'HAS_API_ACCESS']),
    canEdit() {
      return this.HAS_API_ACCESS({
        apiName: 'posts',
        method: 'patch'
      })
    },
    isShowEditGalleryButton() {
      return this.canEdit && !this.loadingGallery
    },
    isShowEditFilesButton() {
      return this.canEdit && !this.loadingFiles
    },
    filteredDate() {
      if (!this.newsData.date) return ''
      const [day, month, year] = this.moment(this.newsData.date, 'DD.MM.YYYY')
        .format('LL')
        .split(' ')
      return `${day} ${month} ${year}`
    },
    author() {
      const author = this.newsData.author
      if (!author) return ''
      if (!author.employee) return ''
      const employee = author.employee
      return `${employee.name} ${employee.surname}`
    },
    newsId() {
      return this.$route.params.id
    },
    hasGalleryImages() {
      return !!this.galleryImages.length
    },
    hasFiles() {
      return !!this.attachedFiles.length
    },
    filesAreaIsVisible() {
      return !this.isEventNews && !this.isAnnounceNews
    }
  },
  methods: {
    toggleEditNewsModal() {
      this.isOpenEditNewsModal = !this.isOpenEditNewsModal
    },
    async fetchNews() {
      const news = (await http.get(`/posts/${this.newsId}`)).data.data
      this.newsData = newsFilter(news)
      this.loading = false
      this.setPageTitle(this.newsData.title)
    },
    async fetchGalleryImages() {
      await http
        .get(`/posts/${this.newsId}/media/gallery`)
        .then(response => {
          response.data.data.forEach(element => {
            this.galleryImages.push(element)
          })
        })
        .finally(() => {
          this.loadingGallery = false
        })
    },
    async fetchFiles() {
      await http
        .get(`/posts/${this.newsId}/media/files`)
        .then(response => {
          response.data.data.forEach(element => {
            this.attachedFiles.push(element)
          })
        })
        .finally(() => {
          this.loadingFiles = false
        })
    }
  }
}
</script>
