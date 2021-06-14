<template>
  <ul class="d-flex flex-wrap align-self-stretch">
    <router-link
      v-for="menuItem in menuLinks"
      :key="menuItem.title"
      :to="menuItem.path"
      custom
      v-slot="{ navigate }"
    >
      <li @click="navigate" class="nav-item d-flex">
        <a :href="menuItem.path" class="nav-link d-flex align-items-center">{{ menuItem.title }}</a>
        <ul v-if="menuItem.children" class="dropdown">
          <router-link
            v-for="child in menuItem.children"
            :key="child.title"
            :to="child.path"
            custom
            v-slot="{ navigate }"
          >
            <li @click="navigate" class="dropdown-item">
              <a class="dropdown-link">{{ child.title }}</a>
            </li>
          </router-link>
        </ul>
      </li>
    </router-link>
  </ul>
</template>

<script>
import links from '@/config/mainMenuLinks'

export default {
  name: 'HeaderBottom',
  data: () => ({
    menuLinks: links
  })
}
</script>
