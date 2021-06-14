<template>
  <div class="editor">
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="editor-menubar">
        <div class="menubar__button" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          <svg-icon class="mr-1" name="bold" title="жирный" />
        </div>
        <div class="menubar__button" :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
          <svg-icon class="mr-1" name="italic" title="курсив" />
        </div>

        <div class="menubar__button" :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
          <svg-icon class="mr-1" name="strike" title="зачеркнуть" />
        </div>

        <div
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <svg-icon class="mr-1" name="underline" title="подчеркнуть" />
        </div>

        <div
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </div>

        <div
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </div>

        <div
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </div>

        <div
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <svg-icon class="mr-1" name="ul" title="маркированный список" />
        </div>

        <div
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <svg-icon class="mr-1" name="ol" title="нумерованный список" />
        </div>

        <div
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <svg-icon class="mr-1" name="quote" title="цитата" />
        </div>

        <div
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <svg-icon class="mr-1" name="code" title="блок кода" />
        </div>

        <div class="position-relative">
          <span class="menubar__button" ref="colorPickerButton" @click="toggleColorPicker">
            <svg-icon class="mr-1" name="format_color_text" title="цвет текста" />
          </span>
          <span v-if="isOpenColorPicker" ref="colorPicker" class="color-picker">
            <span
              v-for="color in colorPickerColors"
              :key="color[0]"
              :class="`color-picker-item ${color[0]}`"
              @click="setColorToText(commands, color[1])"
            ></span>
          </span>
        </div>

        <div
          class="menubar__button"
          @click="commands.createTable({ rowsCount: 3, colsCount: 3, withHeaderRow: false })"
        >
          <svg-icon name="table" title="таблица" />
        </div>

        <div v-if="isActive.table()" class="d-flex">
          <div class="menubar__button" @click="commands.deleteTable">
            <svg-icon name="delete_table" title="удалить таблицу" />
          </div>
          <div class="menubar__button" @click="commands.addColumnBefore">
            <svg-icon name="add_col_before" title="добавить столбец справа" />
          </div>
          <div class="menubar__button" @click="commands.addColumnAfter">
            <svg-icon name="add_col_after" title="добавить столбец слева" />
          </div>
          <div class="menubar__button" @click="commands.deleteColumn">
            <svg-icon name="delete_col" title="удалить столбец" />
          </div>
          <div class="menubar__button" @click="commands.addRowBefore">
            <svg-icon name="add_row_before" title="добавить строку снизу" />
          </div>
          <div class="menubar__button" @click="commands.addRowAfter">
            <svg-icon name="add_row_after" title="добавить строку сверху" />
          </div>
          <div class="menubar__button" @click="commands.deleteRow">
            <svg-icon name="delete_row" title="удалить строку" />
          </div>
          <div class="menubar__button" @click="commands.toggleCellMerge">
            <svg-icon name="combine_cells" title="объединить ячейки" />
          </div>
        </div>
        <!-- LINK -->
        <div class="position-relative">
          <span
            class="menubar__button link-button"
            :class="{ 'is-active': isActive.link() }"
            ref="linkButton"
            @click="toggleLinkMenu"
          >
            <svg-icon class="mr-1" name="link" title="ссылка" />
          </span>

          <editor-menu-bubble
            class="menububble"
            :class="{ 'is-visible': linkMenuIsVisible }"
            ref="linkForm"
            :editor="editor"
            @hide="hideLinkMenu"
            v-slot="{ commands, isActive, getMarkAttrs }"
          >
            <div class="menububble" :class="{ 'is-active': linkMenuIsVisible }">
              <form
                class="menububble__form"
                v-if="linkMenuIsActive"
                @submit.prevent="setLinkUrl(commands.link, linkUrl)"
              >
                <div class="menububble__form-info">
                  <svg-icon name="info" />
                </div>
                <input
                  class="menububble__input"
                  type="text"
                  v-model="linkUrl"
                  placeholder="https://"
                  ref="linkInput"
                  @keydown.esc="hideLinkMenu"
                />
                <button class="menububble__button" type="submit">
                  <span>OK</span>
                </button>
                <button class="menububble__button" @click="setLinkUrl(commands.link, null)" type="button">
                  <svg-icon name="remove" />
                </button>
              </form>

              <template v-else>
                <button
                  class="menububble__button"
                  @click="showLinkMenu(getMarkAttrs('link'))"
                  :class="{ 'is-active': isActive.link() }"
                >
                  <span>{{ isActive.link() ? 'Обновить ссылку' : 'Добавить ссылку' }}</span>
                  <svg-icon name="link" />
                </button>
              </template>
            </div>
          </editor-menu-bubble>
        </div>

        <div class="menubar__button" :class="{ 'is-active': isSourceMode }" @click="toggleSourceMode()">
          <svg-icon class="mr-1" name="file-code" title="источник" />
        </div>

        <div class="menubar__button" @click="commands.undo">
          <svg-icon class="mr-1" name="undo" title="отменить" />
        </div>

        <div class="menubar__button" @click="commands.redo">
          <svg-icon class="mr-1" name="redo" title="повторить" />
        </div>
        <!-- CLEAR -->
        <!-- <div class="menubar__button" @click="setUrl(commands.link)">
          <svg-icon class="mr-1" name="code" title="Очистить форматирование" />
        </div> -->
      </div>
    </editor-menu-bar>

    <editor-content :editor="editor" class="editor-content" />

    <div v-if="isSourceMode" class="editor-source-code mt-10">
      <h5>Источник</h5>
      <div>
        <code>{{ editor.getHTML() }}</code>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import '@/styles/elements/_tiptap-text-editor.scss'
import FontTextColorMark from '@/functions/text-editor-functions/FontTextColor.js'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow
} from 'tiptap-extensions'
import colors from '@/styles/_export.scss'

export default {
  name: 'BaseTextEditor',
  components: {
    SvgIcon: () => import('@/components/Elements/SvgIcon'),
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble
  },
  props: {
    parentValue: {}
  },
  data: () => ({
    editor: null,
    editorJson: null,
    isOpenColorPicker: false,
    isSourceMode: false,
    linkMenuIsVisible: false,
    linkUrl: null,
    linkMenuIsActive: false
  }),
  mounted() {
    this.editor = new Editor({
      content: this.parentValue,
      onUpdate: ({ getJSON, getHTML }) => {
        this.editorJson = getJSON().content
        this.$emit('update:parentValue', getHTML())
        this.$emit('is-empty-value', this.isEmptyEditor)
      },
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new HorizontalRule(),
        new ListItem(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new History(),
        new Table({
          resizable: true
        }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new FontTextColorMark()
      ]
    })

    this.setMenuLinkListener()
    this.setColorPickerListener()
  },
  beforeDestroy() {
    if (this.editor) this.editor.destroy()
  },
  watch: {
    parentValue() {
      if (this.parentValue === '') this.editor.setContent(this.parentValue)
    }
  },
  computed: {
    isEmptyEditor() {
      if (this.editorJson) {
        if (this.editorJson.find(item => item.content)) return true
      }
      return false
    },
    colorPickerColors() {
      const prefix = 'color-picker-bg-primary'
      return [
        [`${prefix}-black`, colors.black],
        [`${prefix}-danger`, colors.red],
        [`${prefix}-orange`, colors.orange],
        [`${prefix}-yellow`, 'yellow'],
        [`${prefix}-success`, colors.green],
        [`${prefix}-blue`, colors.blue],
        [`${prefix}-purple-link`, colors.purple],

        [`bg-white`, 'white'],
        [`${prefix}-light-red`, colors.lightRed],
        [`bg-warning`, colors.warning],
        [`${prefix}-light-blue`, colors.lightBlue],
        [`${prefix}-turquoise`, colors.turquoise],
        [`${prefix}-brown`, colors.brown],
        [`${prefix}-dark-gray`, '']
      ]
    }
  },
  methods: {
    toggleColorPicker() {
      this.isOpenColorPicker = !this.isOpenColorPicker
    },
    toggleLinkMenu() {
      this.linkMenuIsVisible = !this.linkMenuIsVisible
    },
    toggleSourceMode() {
      this.isSourceMode = !this.isSourceMode
    },
    setMenuLinkListener() {
      document.addEventListener('click', item => {
        if (
          item.target.closest('.link-button') !== this.$refs.linkButton &&
          item.target.closest('.link-form') !== this.$refs.linkForm &&
          !item.target.closest('.menububble__button') &&
          !item.target.closest('.menububble') &&
          !item.target.closest('.menububble__input') &&
          !item.target.closest('.menububble__form-info')
        ) {
          this.linkMenuIsVisible = false
        }
      })
    },
    setColorPickerListener() {
      document.addEventListener('click', item => {
        if (
          item.target.closest('.color-picker') !== this.$refs.colorPicker &&
          item.target.closest('.menubar__button') !== this.$refs.colorPickerButton
        ) {
          this.isOpenColorPicker = false
        }
      })
    },
    setColorToText(editorCommands, textColor) {
      editorCommands.mark({ color: textColor })
      this.toggleColorPicker()
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
      this.linkMenuIsVisible = false
    },
    setLinkUrl(command, url) {
      command({ href: url })
      this.hideLinkMenu()
    }
  }
}
</script>
