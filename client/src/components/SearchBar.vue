<template>
  <section>
    <input type='text' placeholder='Start typing...' @input='debounceInput' />
  </section>
</template>

<script>
import debounce from 'debounce';

export default {
  name: 'search-bar',
  methods: {
    debounceInput: debounce(function(event) {
      this.$emit('input', event.target.value);
    }, 500)
  }
};
</script>

<style scoped lang='scss'>
section {
  width: 100%;
  padding: 3rem 2rem 2rem;
  background-color: #eee;
  transition: background-color 0.2s;
  will-change: background-color;
  position: relative;

  &::after {
    content: '';
    width: 0;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #673ab7;
    transition: width 0.2s;
    position: absolute;
    will-change: width;
  }
  &:focus-within::after {
    width: 100%;
  }
}
input {
  font-size: 48px;
  width: 100%;
  line-height: 56px;
  letter-spacing: -0.005em;
  font-weight: 600;
  color: #212121;
  text-transform: none;
  caret-color: #673ab7;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: transparent;
  border: none;
  &::placeholder {
    color: #ccc;
    transition: color 0.2s;
    will-change: color;
  }
  &:focus {
    outline: none;
    &::placeholder {
      color: #999;
    }
  }
}
</style>