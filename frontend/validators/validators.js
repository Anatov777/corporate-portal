import { helpers } from 'vuelidate/lib/validators'

export const aliasRegex = helpers.regex('alpha', /^[A-Za-z0-9-]*$/)
export const phoneRegex = helpers.regex('alpha', /^[0-9()-\s]*$/)
