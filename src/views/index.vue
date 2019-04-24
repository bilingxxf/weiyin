<template>
    <div class="home">
       <layout></layout>
    </div>
</template>
<script>
import layout from '@/views/layout/layout'
export default {
  components: {
    layout
  }
}
</script>
<style lang="scss">

.home{ 
    height: 100%;
    margin: 0 auto;
    .el-header{
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
}
</style>
