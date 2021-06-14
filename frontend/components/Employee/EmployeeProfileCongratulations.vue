<template>
  <div class="profile-details">
    <div class="profile-details__item">
      <div>День рождения</div>
      <div class="profile-details__value">{{ profileBirthday }}</div>
      <div class="display-permission">
        <label class="display-permission__item">
          <input
            v-model="congratulationsCheckboxValue"
            type="checkbox"
            :disabled="!hasEditingRights"
            @change="onChangeAllowCongratulationsHandler"
          />
          <span class="checkbox-control"></span>
          <span>Отображать в блоке поздравлений?</span>
        </label>
      </div>
    </div>
    <div class="profile-details__item">
      <div>Табельный номер</div>
      <div class="profile-details__value pb-0">{{ employeeNumber }}</div>
    </div>
    <base-modal
      v-if="isOpenAllowCongratulationsModal"
      :is-show="isOpenAllowCongratulationsModal"
      @close="onCancelModalHandler"
      @confirm="toggleAllowCongratulations"
      @cancel="onCancelModalHandler"
    >
      <template slot="header">
        Подтверждение
      </template>
      <template slot="body">
        Теперь сообщения о ваших днях рождения и памятных событиях не будут отображаться на главной странице.
        Вы уверены, что хотите продолжить?
      </template>
      <template slot="yes">
        OK
        <loader v-if="isUpdatingAllowCongratulations" class="ml-2" size="sm" color="white" />
      </template>
      <template slot="no">Отмена</template>
    </base-modal>
  </div>
</template>

<script>
import http from '@/modules/http'
import { mapGetters } from 'vuex'

export default {
  name: 'EmployeeProfileCongratulations',
  components: {
    BaseModal: () => import('@/components/Elements/BaseModal'),
    Loader: () => import('@/components/Elements/Loader')
  },
  props: {
    profileBirthday: {
      type: String
    },
    employeeNumber: {
      type: String
    },
    isAllowCongratulations: {
      type: [Boolean, Number]
    }
  },
  data: () => ({
    isOpenAllowCongratulationsModal: false,
    congratulationsCheckboxValue: null,
    isUpdatingAllowCongratulations: false
  }),
  created() {
    this.congratulationsCheckboxValue = this.isAllowCongratulations
  },
  watch: {
    congratulationsCheckboxValue() {
      this.$emit('update:isAllowCongratulations', this.congratulationsCheckboxValue)
    }
  },
  computed: {
    hasEditingRights() {
      return this.HAS_RIGHTS()(['info.own.manage'])
    }
  },
  methods: {
    ...mapGetters(['HAS_RIGHTS']),
    async onChangeAllowCongratulationsHandler() {
      this.isAllowCongratulations
        ? this.toggleAllowCongratulationsModal()
        : await this.toggleAllowCongratulations()
    },
    toggleAllowCongratulationsModal() {
      this.isOpenAllowCongratulationsModal = !this.isOpenAllowCongratulationsModal
    },
    closeAllowCongratulationsModal() {
      this.isOpenAllowCongratulationsModal = false
    },
    onCancelModalHandler() {
      this.congratulationsCheckboxValue = !this.congratulationsCheckboxValue
      this.closeAllowCongratulationsModal()
    },
    async toggleAllowCongratulations() {
      this.isUpdatingAllowCongratulations = true
      await http
        .patch(`/employees/${this.$route.params.id}/toggle-allow-congrat`)
        .then(response => {
          this.$emit('update:isAllowCongratulations', response.data.data.allow_congrat)
          this.closeAllowCongratulationsModal()
        })
        .catch(error => console.error(error))
        .finally(() => {
          this.isUpdatingAllowCongratulations = false
        })
    }
  }
}
</script>
