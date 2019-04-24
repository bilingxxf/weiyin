<template>
  <div class="main">
    <router-view :key="getKey"/>
  </div>
</template>

<script>
    export default {
        name: "mainbody",
        computed:{
          getKey() {
            return this.$route.fullPath
          }
        }
    }
</script>

<style scoped lang="scss">

</style>
