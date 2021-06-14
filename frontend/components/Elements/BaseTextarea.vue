<template>
  <div class="textarea">
    <textarea
      v-model="currentValue"
      :class="className"
      :style="inputStyle"
      :placeholder="placeholder"
      @keyup="resize"
      @change="handleChange"
    ></textarea>
    <textarea class="shadow" v-model="currentValue" ref="shadow" tabindex="0"></textarea>
  </div>
</template>

<script>
export default {
  name: 'BaseTextarea',
  props: {
    value: String,
    className: String,
    maxHeight: String,
    placeholder: String
  },
  data() {
    return {
      currentValue: '',
      inputHeight: '0'
    }
  },
  watch: {
    currentValue() {
      this.resize()
      this.$emit('input', this.currentValue)
    }
  },
  computed: {
    inputStyle() {
      return {
        'min-height': this.inputHeight
      }
    }
  },
  created() {
    this.currentValue = this.value
  },
  mounted() {
    this.resize()
  },
  methods: {
    resize() {
      if (this.$refs.shadow.scrollHeight < this.maxHeight) {
        this.inputHeight = `${this.$refs.shadow.scrollHeight}px`
      } else this.inputHeight = `${this.maxHeight}px`
    },
    handleChange() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss">
.textarea {
  position: relative;
  textarea {
    padding: 8px;
    border: 1px solid $light-gray;
    resize: none;
    overflow: hidden;
    font-size: 13px;
    height: 17px;

    &.shadow {
      max-height: 0;
      pointer-events: none;
      opacity: 0;
      margin: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
