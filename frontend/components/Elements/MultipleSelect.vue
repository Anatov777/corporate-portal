<template>
  <div class="multiple-select">
    <div v-for="field in fieldCounter" :key="field" class="multiple-select-content">
      <base-select
        :label-text="labelText"
        :option-key="optionKey"
        :select-options="selectOptions"
        :selected-value.sync="fields[field - 1]"
        :placeholder-text="placeholderText"
        :is-form-invalid.sync="multiSelectFormIsInvalid"
        :form-validation-config-value="fieldIsNotRequiered(field)"
        class="w-100"
        @update:selectedValue="updateSelectedValue"
        @update:isFormInvalid="updateFormValidationInfo"
      >
        <slot>
          <div v-if="editFieldsButtonIsVisible(field)" class="multiple-select-edit-buttons">
            <button
              v-if="field === fieldCounter"
              class="multiple-select-button"
              title="добавить еще сотрудника"
              :disabled="addFieldButtonIsDisabled"
              @click.prevent="addSelect"
            ></button>
            <button
              v-if="field > 1"
              class="multiple-select-button multiple-select-button-remove"
              title="удалить сотрудника"
              @click.prevent="removeSelect(field)"
            ></button>
          </div>
        </slot>
      </base-select>
    </div>
  </div>
</template>

<script>
import '@/styles/modules/multiple-select.scss'
import formsActionsMixin from '@/mixins/formsActions.mixin'

export default {
  name: 'MultipleSelect',
  components: {
    BaseSelect: () => import('@/components/Elements/BaseSelect')
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
    }
  },
  mixins: [formsActionsMixin],
  data: () => ({
    fieldCounter: 1,
    fields: [],
    multiSelectFormIsInvalid: null,
    fieldIsAdded: false
  }),
  created() {
    this.fields = this.selectedValue || []
    this.fieldCounter = this.fields?.length || 1
    this.multiSelectFormIsInvalid = this.isFormInvalid
  },
  watch: {},
  computed: {
    addFieldButtonIsDisabled() {
      return this.fields.length === this.fieldCounter - 1
    }
  },
  methods: {
    addSelect() {
      this.fieldIsAdded = true
      this.fieldCounter++
    },
    removeSelect(field) {
      if (this.fields[field - 1]) this.fields.splice(field - 1, 1)
      else this.fieldCounter--
    },
    updateSelectedValue() {
      let fieldsCopy = [...this.fields]
      fieldsCopy.forEach(item => {
        if (!item) {
          let fieldIndex = this.fields.indexOf(item)
          this.fields.splice(fieldIndex, 1)
          if (this.fields[fieldIndex - 1] && !this.fieldIsAdded) this.fieldCounter--
        }
      })
      if (!this.fields?.length && this.fieldCounter > 1) this.fieldCounter--
      this.fieldIsAdded ? (this.fieldIsAdded = false) : ''
      this.$emit('update:selectedValue', this.fields)
    },
    updateFormValidationInfo() {
      this.$emit('update:isFormInvalid', !this.fields[0])
    },
    fieldIsNotRequiered(field) {
      if (field !== 1) return 'not required'
    },
    editFieldsButtonIsVisible(field) {
      return field === this.fieldCounter || field > 1
    }
  }
}
</script>
