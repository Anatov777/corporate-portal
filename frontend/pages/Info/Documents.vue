<template>
  <div>
    <page-content-top>
      <h2 class="title">
        Шаблоны документов
      </h2>
    </page-content-top>
    <page-content-main class="document-content-main">
      <div class="row document-files" v-if="files">
        <file-card :file="file" v-for="file in files" :key="file.id" />
      </div>
    </page-content-main>
  </div>
</template>

<script>
import 'styles/modules/info/documents.scss'
export default {
  name: 'Documents',
  components: {
    FileCard: () => import('@/components/FileCard'),
    PageContentTop: () => import('@/components/Common/PageContentTop'),
    PageContentMain: () => import('@/components/Common/PageContentMain')
  },
  data: () => ({
    files: [
      {
        id: '71',
        title: 'Информационное письмо о коронавирусе',
        path: '/files/post/post/154/files/COVID-19.docx',
        size: '19&nbsp;Кб',
        description: 'Разработано А. В. Маслюковой',
        extension: 'docx'
      },
      {
        id: '72',
        title: 'Приказ №5 от 17.03.2020 года',
        path: '/files/post/post/154/files/Prikaz---5.pdf',
        size: '2&nbsp;Мб',
        description:
          'Приказ президента ООО «Нейрософт» о введении режима повышенной готовности в связи с коронавирусом',
        extension: 'pdf'
      },
      {
        id: '73',
        title: 'Инструкция по применению дезинфицирующего средства',
        path: '/files/post/post/154/files/Nika-izoseptik-instr-24-2010.pdf',
        size: '1&nbsp;Мб',
        description: '',
        extension: 'pdf'
      }
    ]
  })
  /*computed: {
    downloadFiles() {
      return this.files.map(file => {
        file.type = 'download'
        return file
      })
    }
  }*/
}
</script>
