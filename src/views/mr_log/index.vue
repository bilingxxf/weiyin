<template>
    <div class="log main-body">
        <div class="main-wrapper-type2" v-loading="loading">
            <div class="page-title">任务日志</div>
            <div class="time-axis" v-if="logList.length!=0">
                <div class="line"></div>
                <ul>
                    <li v-for="(item,index) in logList" :key="index">
                        <div class="circle"></div>
                        <div class="date">{{item.times}}</div>
                        <div class="info">
                            <div v-for="(info,key) in item.data" class="group" :key="key">
                                <span class="time">{{info.time}}</span>
                                <span class="childAccount">{{info.userName}}</span>
                                <span class="port">{{info.module}}</span>
                                <span class="msg">{{info.notification}}</span>    
                            </div>
                        </div>  
                    </li>
                </ul>
            </div>
            <div class="is-null" v-else>暂无数据</div>
            <div class="pagination" v-if="logList.length!=0">
               <el-pagination @current-change="getList" :current-page.sync="currentPage" :page-size="limit" layout="total, prev, pager, next" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
      data(){
        return{
            logList:[],
            currentPage:1,
            limit:10,
            total:0,
            loading:true
        }
      },
      methods:{
        getList(){
            let page=this.currentPage;
            let userId=sessionStorage.getItem('user_id');
            let len=this.limit;
            let url="notifications/"+userId+"/"+page+"/"+len;
            this.$http(url,"GET").then((res)=>{
                if(res.data.error_code==0){
                    let list=res.data.data;
                    this.logList=list.result;
                    this.total=list.total_count;
                }else{
                    this.$message({
                        message: "获取日志失败:" + res.data.error_message,
                        type: "error"
                    })
                }
                this.loading=false;
            }).catch((err)=>{
                console.log(err)
            })
        }
      },
      created(){
        this.loading=true;
        this.getList()
      },
      mounted(){

      }
    }
</script>
<style lang="scss">
    @import "../../style/css/base.scss";
    .log{
        .time-axis{
            overflow: hidden;
            position: relative;
            .line{
                position: absolute;
                left:4px;
                top:3px;
                bottom:0;
                width: 2px;
                background-color: #92c3f7;
            }
            ul{
                overflow: hidden;
                li{
                    padding-bottom: 15px;
                    position: relative;
                    padding-left: 20px;
                }
                .circle{
                    width: 10px;
                    height: 10px;
                    background-color: $t-color;
                    border-radius: 50%;
                    overflow: hidden;
                    position: absolute;
                    left:0px;
                    top:3px;
                    border:solid 2px #fff;
                    z-index: 10;
                }
            }
            .date{
                font-size: 16px;
                color:$t-color;
            }
            .info{
                margin-top: 10px;
                font-size: 14px;
                color:#666;
                overflow: hidden;
                .group{
                    padding:10px 0;
                    display: flex;
                    line-height: 20px;
                }
                .time{
                    margin:0 40px; 
                    width: 120px;
                    display: inline-block;
                }
                .childAccount{
                    width: 150px;
                }
                .port{
                    width: 150px;
                    display: inline-block;
                    margin-right:60px;
                }
                .msg{
                  flex: 1;
                }
            }
        }
    }
</style>
