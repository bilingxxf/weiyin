<template>
  <div class="side">
    <div class="scroll">
      <el-scrollbar class="scroll-bar">
        <el-menu :default-active="$route.name">
          <el-submenu v-for="(menu,index) in sideBarMenu" :key="index" :index="index.toString()" v-if="menu.meta.showRouter!=false">
            <template slot="title">
              <i :class="menu.meta.icon"></i> {{menu.meta.title}}
            </template>
            <el-submenu  v-for="(submenu,subIndex) in menu.children" :key='submenu.meta.title' :index='submenu.meta.index' v-if="submenu.children">
              <template slot="title">{{submenu.meta.title}}</template>
              <router-link :to="part.path" v-for="part in submenu.children" :key = 'part.meta.index'>
                <el-menu-item :index='part.meta.index'>
                  <p>{{part.meta.title}}</p>
                </el-menu-item>
              </router-link>
            </el-submenu>
            <router-link :to="submenu.path" v-for="(submenu,subIndex) in menu.children" :key="submenu.meta.title" v-if="!submenu.children&&submenu.meta.showRouter!=false">
              <el-menu-item :index="submenu.meta.index">
                <p>{{submenu.meta.title}}</p>
              </el-menu-item>
            </router-link>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
  export default {
      name: "sidebar",
      computed:{
        ...mapState([
          'dialogFlag',
          'sideBarMenu'
        ])
      },
      mounted(){

      }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/icon/iconfont.css';
  .side{
    position: fixed;
    left:0;
    top:80px;
    bottom:0;
    z-index: 22;
    width: 200px;
    background-color: #fff;
    text-align: left;
    a{
      display: block;
    }
    p{
      cursor:pointer;
      line-height:50px;
      padding-left: 25px;
    }
    .scroll{
      overflow-x:hidden;
      overflow-y:auto;
      height: 100%;
    }
  }
</style>
