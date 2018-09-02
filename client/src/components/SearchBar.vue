<template>
  <div>
    <input type='text' placeholder='Start typing...' />
  </div>
</template>

<script>
export default {
  name: 'search-bar'
};
</script>

<style scoped lang='scss'>
div {
  width: 100%;
  padding: 2rem 2rem;
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
  &:focus {
    outline: none;
  }
}
</style>