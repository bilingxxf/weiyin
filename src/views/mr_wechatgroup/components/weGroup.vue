<template>
    <div>
      <Dialog @callback="submit" v-if="dialogFlag=='addGroup'" class="check-group">
        <div class="dialog-content" slot="content">
          <div class="group-list">
            <div class="group" v-for="(group,index) in sysGroupList" :key="index">
              <div class="label" v-if="role&&role=='ROLE_USER'" :class="[group.check?'checked':'']" @click="checkGroup(group,index)">{{group.groupName}}</div>
              <div class="info">
                <div class="group-item" :class="[item.check?'checked':'']" v-for="(item,itemIndex) in group.list" :key="itemIndex" @click="checkItem(group,index,itemIndex)">{{item.wx_user_group_name}}({{item.wx_sum_count}})</div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
</template>

<script>
    import Dialog from "@/components/dialog.vue";
    import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
    export default {
        name: "weGroup",
        data(){
          return{
            sysGroupList:[],
            groupIds:[],
            role: sessionStorage.getItem("indentity")||"",
          }
        },
        components:{
          Dialog
        },
        computed: {
          ...mapState(["dialogFlag"])
        },
        props:{

        },
        watch:{

        },
        created(){
          this.getGroupList();
        },
        methods:{
          submit(){
            this.$store.dispatch("hideDialog");
            this.$emit("confirm",this.groupIds);
          },
          checkGroup(group,index){
            this.groupIds=[];
            group.check=!group.check;
            group.list.map((v,k)=>{
              v.check=group.check;
              if(v.check){
                this.groupIds.push(v);
              }
            });
            this.$set(this.sysGroupList,index,group);
          },
          checkItem(group,index,itemIndex){
            let t=0;
            this.groupIds=[];
            group.list[itemIndex].check=!group.list[itemIndex].check;
            group.list.map((v,k)=>{
              if(v.check){
                t++;
                this.groupIds.push(v);
              }
            });
            if(t==group.list.length){
              group.check=true;
            }else{
              group.check=false;
            }
            this.$set(this.sysGroupList,index,group);
          },
          //获取分组列表
          getGroupList(){
            let _this=this;
            let userId=sessionStorage.getItem("user_id");
            _this.$http("wx_group/list","GET",{
              limit:99999,
              page:1
            }).then((res)=>{
              if(res.data.error_code==0){
                let result=res.data.data.result;
                let json={};
                let formatResult=[];
                result.map((v,k)=>{
                  if(!json[v.userName]){
                    json[v.userName]=1;
                  }else{
                    !json[v.userName]++;
                  }
                });
                for(let key in json){
                  let fjson={};
                  let arr=result.filter((v,k)=>{
                    return v.userName==key&&v.wx_sum_count>0;
                  });
                  fjson.groupName=key;
                  if(arr.length>0){
                    formatResult.push(fjson)
                    fjson.list=arr;
                  }
                };
                _this.sysGroupList=formatResult;
              }
            }).catch((err)=>{
              console.log(err)
            })
          },
        }
    }
</script>

<style scoped lang="scss">
  .check-group{
    text-align: left;
    .dialog-content{
      padding:30px 0 !important;
    }
    .group-list{
      overflow: hidden;
      .group{
        display: flex;
        .label,.group-item{
          width: 90px;
          height: 32px;
          line-height: 32px;
          border:solid 1px #ccc;
          color:#333;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
        }
        .checked{
          color: #409EFF;
          border-color:#409EFF;
        }
        .info{
          flex:1;
          display: flex;
          flex-wrap: wrap;
          .group-item{
            margin-left: 10px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>
