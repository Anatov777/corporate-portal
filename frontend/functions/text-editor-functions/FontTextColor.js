import { Mark } from 'tiptap'
import { updateMark } from 'tiptap-commands'

export default class FontTextColorMark extends Mark {
  get name() {
    return 'mark'
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: 'currentColor'
        }
      },
      parseDOM: [
        {
          style: 'color',
          getAttrs: value => (value ? { color: value } : '')
        }
      ],
      toDOM: mark => [
        'span',
        {
          style: `color:${mark.attrs.color}`
        },
        0
      ]
    }
  }

  commands({ type }) {
    return attrs => updateMark(type, attrs)
  }
}
