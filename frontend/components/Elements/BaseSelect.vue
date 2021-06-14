<template>
  <div>
    <div :class="['form-group modal-form-group', { 'flex-column': isColumnDirection }]">
      <label :class="['modal-label', { 'align-self-start': isColumnDirection }]"
        >{{ labelText }} {{ requiredFieldStar }}</label
      >
      <multi-select
        v-if="!isDatePicker"
        v-model="$v.modelValue.$model"
        :options="selectOptions"
        track-by="id"
        :label="optionKey"
        :placeholder="placeholderText"
        :searchable="false"
        :show-labels="false"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span :class="['d-inline-block', { [labelColor(option.id)]: isNewsTypes, label: isNewsTypes }]">
            {{ option[optionKey] }}
          </span>
        </template>
        <span
          class="arrow multiselect__caret"
          slot="caret"
          slot-scope="{ toggle }"
          @mousedown.prevent.stop="toggle"
        >
        </span>
        <template slot="option" slot-scope="{ option }">
          <span
            :class="[
              'd-inline-block label-black',
              { [labelColor(option.id)]: isNewsTypes, 'label text-white': isNewsTypes }
            ]"
          >
            {{ option[optionKey] }}
          </span>
        </template>
      </multi-select>
      <slot></slot>

      <div v-if="isDatePicker" class="date-picker">
        <flat-pickr
          v-model="$v.modelValue.$model"
          :config="datePickerConfig"
          class="form-control modal-form-select"
          placeholder="Выберите дату"
        ></flat-pickr>
        <span class="arrow date-picker-caret"></span>
      </div>
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.modelValue.required && $v.modelValue.$error"
    >
      <small :class="`${errorMessageClass}`">Поле "{{ labelText }}" обязательно для заполнения</small>
    </div>
  </div>
</template>

<script>
import 'vue-multiselect/dist/vue-multiselect.min.css'
import '@/styles/elements/_vue-select.scss'
import '@/styles/elements/_label.scss'
import '@/styles/modules/modal-form.scss'
import { required } from 'vuelidate/lib/validators'
import formsActionsMixin from '@/mixins/formsActions.mixin'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import '@/styles/elements/_date-picker.scss'
import labelNewsTypes from '@/config/labelNewsTypes'

export default {
  name: 'BaseSelect',
  components: {
    MultiSelect: () => import('vue-multiselect'),
    flatPickr
  },
  props: {
    labelText: {
      type: String
    },
    selectOptions: {
      type: Array
    },
    selectedValue: {
      type: [Object, String, Array]
    },
    isFormInvalid: {
      type: Boolean
    },
    placeholderText: {
      type: String,
      default: 'Выберите'
    },
    optionKey: {
      type: String,
      default: 'name'
    },
    formValidationConfigValue: {
      type: String,
      default: null
    },
    isDatePicker: {
      type: Boolean,
      default: false
    },
    isNewsTypes: {
      type: Boolean,
      default: false
    },
    isColumnDirection: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'single'
    }
  },
  mixins: [formsActionsMixin],
  data: () => ({
    modelValue: '',
    datePickerConfig: {
      altFormat: 'd.m.Y',
      altInput: true,
      mode: 'single',
      locale: Russian
    }
  }),
  created() {
    this.modelValue = this.selectedValue
  },
  watch: {
    modelValue() {
      this.$emit('update:selectedValue', this.modelValue)
    },
    selectedValue() {
      this.modelValue = this.selectedValue
      this.updateFormValidInfo()
    },
    isInvalid() {
      this.updateFormValidInfo()
    }
  },
  computed: {
    isInvalid() {
      return this.$v.$invalid
    },
    requiredFieldStar() {
      if (this.formValidationConfigValue !== 'not required') return '*'
      return null
    },
    vuelidateConfigValue() {
      if (this.formValidationConfigValue) return this.formValidationConfigValue
      return this.labelText
    },
    isNotRequired() {
      if (this.vuelidateConfigValue) return this.vuelidateConfigValue.includes('not required')
      else return 0
    },
    errorMessageClass() {
      if (this.isColumnDirection) return 'col-12'
      return 'col-9'
    }
  },
  methods: {
    labelColor(categoryId) {
      return labelNewsTypes[categoryId] ? labelNewsTypes[categoryId].class : labelNewsTypes[0].class
    }
  },
  validations() {
    if (this.isNotRequired) {
      return {
        modelValue: {}
      }
    } else {
      return {
        modelValue: {
          required
        }
      }
    }
  }
}
</script>
