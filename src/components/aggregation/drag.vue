<template>
	<el-dialog
    title="调整顺序"
    :visible.sync="value"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="table-modal"
    width="400px">
    <div class="edit-group">
      <span>批量操作：</span>
      <span class="edit-btn" @click="deleteAll">删除</span>
    </div>
    <div class="drag-modal root">
      <SortableList lockAxis="y" v-model="currentSelectors">
        <li class="list-item th">
          <a class="f1">微信号</a>
          <a class="f2">操作</a>
        </li>
        <SortableItem v-for="(item, index) in currentSelectors" :index="index" :key="index" :item="item" :deleteSingle="deleteSingle"/>
        <div v-if ="!currentSelectors.length" class="el-table__empty-block">
          <span class="el-table__empty-text">暂无数据</span>
        </div>
      </SortableList>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="ele-btn" type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {ContainerMixin, ElementMixin} from 'vue-slicksort'

  const SortableList = {
    mixins: [ContainerMixin],
    template: `
      <ul class="list">
        <slot />
      </ul>
    `,
  };

  const SortableItem = {
    mixins: [ElementMixin],
    props: ['item', 'index', 'deleteSingle'],
    template: `
      <li class="list-item">
        <a class="f1">{{item.wx_username + '(' + item.nickname + ')'}}</a>
        <a class="f2 min"><span class="f3" @click="deleteSingle(index)">删除</span></a>
      </li>
    `,
  };

	export default{
    components: {
      SortableItem,
      SortableList,
    },
    data() {
      return {
        currentSelectors: this.selectors
      };
    },
    watch: {
      value: (newVal) => {
        if (newVal) {
          setTimeout(()=> {
            const eles = document.getElementsByClassName('f3')
                Array.prototype.slice.call(eles).map((v, i) => {
                  v.onmousedown = (e) => {
                    e.stopPropagation()
                  }
                })
          },0)
        }
      }, 
      selectors:{
        handler(newValue,oldValue){
          this.currentSelectors = [...newValue]
        },
        deep:true
      },
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      selectors: {
        type: Array,
        default: []
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      submitForm() {
        this.$emit('returnValue', this.currentSelectors)
        this.handleClose(false)
      },
      deleteAll() {
        this.currentSelectors = []
      },
      deleteSingle(i) {
        this.currentSelectors.splice(i, true)
      },
      handleClose(reset) {
        if (reset) this.currentSelectors = [...this.selectors]
        this.$emit('change', false)
      }
    }
  }
</script>

<style lang="scss">
  .drag-modal {
    margin-top: 16px;
    .list {
      max-height: 500px;
      overflow: auto;
      border: 1px solid #EBEEF5;
    }
  }
</style>
