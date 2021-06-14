<template>
  <footer class="footer-wrap">
    <div class="footer container d-flex justify-content-between align-items-center">
      <div class="footer-left">
        <p>ООО &#34;Нейрософт&#34;, {{ currentYear }}</p>
        <p>Медицинское оборудование</p>
      </div>
      <div class="footer-right d-flex align-items-center">
        <span class="footer-right__subscribe">Подписывайся в соц сетях</span>
        <div class="social-links d-flex">
          <a
            class="social-link"
            target="_blank"
            v-for="(social, name) in socialLinks"
            :key="social.name"
            :href="social.path"
            :style="{ 'background-image': `url(${require('@/assets/icon/' + name + '.svg')})` }"
            :class="`social-link--${name}`"
          ></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data: () => ({
    socialLinks: {
      insta: {
        path: 'https://www.instagram.com/neurosoft_llc/'
      },
      vk: {
        path: 'https://vk.com/neurosoft'
      }
    }
  }),
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>
