<template>
  <div>
    <div class="form-group modal-form-group">
      <label class="modal-label" for="baseCheckbox">{{ labelText }} {{ requiredFieldStar }}</label>
      <slot name="form-group-input">
        <input
          v-if="inputType === 'input'"
          v-model="$v.modelValue.$model"
          class="form-control modal-form-input"
          :type="valueType"
          :disabled="isDisableInput"
          @change="setDirtyField"
        />
        <textarea
          v-else-if="inputType === 'textarea'"
          v-model="$v.modelValue.$model"
          class="base-textarea"
        ></textarea>
        <base-text-editor
          class="editor-small"
          v-else-if="isTextEditor"
          :parent-value.sync="$v.modelValue.$model"
          @is-empty-value="setEditorValue($event)"
        />

        <files-loader
          v-else-if="inputType === 'files'"
          :files.sync="modelValue"
          :is-multiple="isMultipleFiles"
          :file-type="fileType"
          @change:files="updateFiles"
          @update-image="setUpdatedImage($event)"
          @delete-image="setDeletedImage($event)"
        ></files-loader>

        <div v-else-if="inputType === 'checkbox'" class="base-checkbox">
          <input v-model="modelValue" id="baseCheckbox" type="checkbox" />
          <span class="checkbox-control"></span>
        </div>
      </slot>
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.modelValue.required && $v.modelValue.$error"
    >
      <small class="error-message">Поле "{{ labelText }}" обязательно для заполнения</small>
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.modelValue.phoneRegex && $v.modelValue.$error && isPhone"
    >
      <small class="error-message">Неверный формат номера телефона</small>
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.modelValue.aliasRegex && $v.modelValue.$error && isAlias"
    >
      <small class="error-message">Поле "alias" должно содержать только латинские буквы, цифры и тире.</small>
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.modelValue.minLength && $v.modelValue.$error && isPhone"
    >
      <small class="error-message">Минимальная длина номера телефона - 11 цифр</small>
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.modelValue.email && $v.modelValue.$error && isEmail"
    >
      <small class="error-message">Неверный формат E-mail</small>
    </div>
    <div
      class="text-danger pb-2 row justify-content-end"
      v-show="!$v.modelValue.minLength && $v.modelValue.$error && isDateYear"
    >
      <small class="error-message">Минимальная длина года - 4 цифры</small>
    </div>
  </div>
</template>

<script>
import '@/styles/elements/_label.scss'
import '@/styles/modules/modal-form.scss'
import { required, email, minLength } from 'vuelidate/lib/validators'
import { aliasRegex, phoneRegex } from '@/validators/validators'
import formsActionsMixin from '@/mixins/formsActions.mixin'
import '@/styles/elements/_base-textarea.scss'
import '@/styles/elements/_checkbox.scss'

export default {
  name: 'BaseFormGroup',
  components: {
    FilesLoader: () => import('@/components/Elements/FilesLoader'),
    BaseTextEditor: () => import('@/components/Elements/BaseTextEditor')
  },
  props: {
    labelText: {
      type: String
    },
    inputValue: {},
    isDisableInput: {
      type: Boolean,
      default: false
    },
    isFormInvalid: {
      type: Boolean
    },
    formValidationConfigValue: {
      type: String,
      default: null
    },
    inputType: {
      type: String,
      default: 'input'
    },
    valueType: {
      type: String,
      default: 'text'
    },
    maxLength: {
      type: String,
      default: null
    },
    isMultipleFiles: {
      type: Boolean,
      required: false,
      default: false
    },
    fileType: {
      type: String,
      required: false,
      default: 'image'
    }
  },
  mixins: [formsActionsMixin],
  data: () => ({
    modelValue: null
  }),
  created() {
    this.modelValue = this.inputValue
  },
  watch: {
    modelValue() {
      if (this.maxLength && this.modelValue.length > this.maxLength) {
        this.modelValue = this.modelValue.slice(0, this.maxLength)
      }
      this.$emit('update:inputValue', this.modelValue)
    },
    isInvalid() {
      this.updateFormValidInfo()
    },
    inputValue() {
      this.modelValue = this.inputValue
      this.updateFormValidInfo()
    }
  },
  computed: {
    vuelidateConfigValue() {
      if (this.formValidationConfigValue) return this.formValidationConfigValue
      return this.labelText
    },
    requiredFieldStar() {
      if (this.formValidationConfigValue !== 'not required') return '*'
      return null
    },
    isPhone() {
      if (this.vuelidateConfigValue)
        return this.vuelidateConfigValue.includes('Телефон') || this.vuelidateConfigValue.includes('Билайн')
      else return 0
    },
    isEmail() {
      if (this.vuelidateConfigValue) return this.vuelidateConfigValue.includes('E-mail')
      else return 0
    },
    isDateYear() {
      if (this.vuelidateConfigValue) return this.vuelidateConfigValue.includes('dateYear')
      else return 0
    },
    isAlias() {
      if (this.vuelidateConfigValue) return this.vuelidateConfigValue.includes('alias')
      else return 0
    },
    isNotRequired() {
      if (this.vuelidateConfigValue) return this.vuelidateConfigValue.includes('not required')
      else return 0
    },
    isInvalid() {
      return this.$v.$invalid
    },
    isTextEditor() {
      return this.inputType === 'text-editor'
    }
  },
  methods: {
    setDirtyField() {
      this.$v.modelValue.$touch()
    },
    updateFiles(files) {
      this.modelValue = files
    },
    setDeletedImage(event) {
      this.$emit('delete-image', event)
    },
    setUpdatedImage(event) {
      this.$emit('update-image', event)
    },
    setEditorValue(isEmptyTextEditor) {
      if (!isEmptyTextEditor) this.modelValue = ''
    }
  },
  validations() {
    if (this.labelText) {
      if (this.isPhone) {
        return {
          modelValue: {
            required,
            phoneRegex,
            minLength: minLength(11)
          }
        }
      } else if (this.isEmail) {
        return {
          modelValue: {
            required,
            email
          }
        }
      } else if (this.isDateYear) {
        return {
          modelValue: {
            required,
            minLength: minLength(4)
          }
        }
      } else if (this.isAlias) {
        return {
          modelValue: {
            required,
            aliasRegex
          }
        }
      } else if (this.isNotRequired) {
        return {
          modelValue: {}
        }
      }
    }
    return {
      modelValue: {
        required
      }
    }
  }
}
</script>
