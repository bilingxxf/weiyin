<template>
  <div id="app">
      <router-view/>
      <!--<Layout></Layout>-->
  </div>
</template>

<script>
  import Layout from "./views/layout/layout"
  export default {
    name: 'App',
    components:{
      Layout
    }
  }
</script>

<style>
#app{
  background-color: #e8eff6;
  min-height: 100vh;
}
</style>
