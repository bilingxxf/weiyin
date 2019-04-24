<template>
  <div>
    <el-dialog
      title="新建任务"
      :visible.sync="value"
      :before-close="handleClose"
      :close-on-click-modal="false"
      class="element-modal"
      width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="任务名称" prop="planName">
          <el-input v-model="ruleForm.planName" placeholder="请输入任务名称" :maxLength="30" style="width: 260px"></el-input>
        </el-form-item>
        <el-form-item label="微信号" prop="wxIds">
          <el-input style="width: auto" v-model="ruleForm.wxIds" type="hidden" ></el-input>
          <el-button type="primary" icon="el-icon-plus" class="wx" size="mini" @click="showTransfer = true"></el-button>
          <span class="wx-line" :class="selectors.length ? 'show' : ''">共 <a>{{selectors.length}}</a> 个微信号，您可以<a @click="showOrder = true">手动调整顺序</a></span>
        </el-form-item>
        <el-form-item label="执行时间" v-if="value" prop="execute_time">
          <el-date-picker
            popper-class="modal-picker"
            v-model="ruleForm.execute_time"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="startTime"
            :editable = "false"
            :clearable = "false"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="ele-btn" type="primary" @click="submitForm">确定</el-button>
        <el-button class="ele-default" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
    <Transfer 
      v-model="showTransfer"
      @returnValue = 'returnValue'
      @returnIds = 'returnIds'
      :selectors = "selectors" />
    <Drag v-model="showOrder" :selectors = "selectors" @returnValue = 'returnValue'  />
  </div>
</template>

<script>
  import Transfer from '@/components/aggregation/transfer'
  import Drag from '@/components/aggregation/drag'
  import API from '@/api/apis'

  function getTime(dateStr) {
    const reg = /(\d{2})\s(\d{4})\s(\d+\:\d+\:\d+)/
    let current = !!dateStr ? new Date(dateStr) : new Date()
    const month = current.getMonth() + 1
    current = reg.exec(current.toString())
    return `${current[2]}-${(month > 9) ? month : ('0' + month)}-${current[1]} ${current[3]}`
  }

  const last20 = () => {
    return getTime(new Date().getTime() + 20 * 60 * 1000)
  }

	export default{
    data() {
      const validateDate =  (rule, value, callback) => {
        if (Date.now() >= new Date(value).getTime()) {
          callback(new Error('执行时间有误，请重新选择'));
        } else {
          callback();
        }
      }

      const validateName = (rule, value, callback) => {
        if (value.replace(/\s/g, '') === '') {
          callback(new Error('名称不能为空'));
        } else {
          callback();
        }
      }

      return {
        showTransfer: false,
        showOrder: false,
        selectors: [],
        selectorIds: [],
        loading: false,
        ruleForm: {
          planName: '',
          execute_time: last20(),
          wxIds: null
        },
        startTime: {
          disabledDate: time => {
            return time.getTime() <= Date.now()-3600*1000*24;
          }
        },
        rules: {
          planName: [{ required: true, message: '请输入任务名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }],
          wxIds: { required: true, message: '请选择微信号', trigger: 'change' },
          execute_time: [
            { required: true },
            { validator: validateDate, trigger: 'blur' }]
        }
      }
    },
    components: {
      Transfer,
      Drag
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      success: {
        type: Function
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      value(newVal) {
        if (newVal) {
            this.ruleForm.execute_time = last20()
        }
      }
    },
    methods: {
      failed () {
        this.$message.error('创建失败')
      },
      setRemData(arr) {
        let newer = []
        for (let i = 0; i < arr.length; i++) {
          newer.push({
            score: i+1,
            value: arr[i]
          })
        }
        return newer
      },
      submitForm() {

        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.loading) return
            if ( this.selectors.length > 300 ) {
              this.$message.error('系统限制单个任务微信号数量不能超过300，请重新选择')
            } else {
              this.loading = true
              let wxIds = this.selectorIds.join(',')
              const redisKey = Date.now() + sessionStorage.getItem('user_id')

              API.wx_codes(this.selectorIds).then(res => {
                if (res.data.error_code === 0) {

                  let data = res.data.data
                  data.map((v, i) => {
                    if (!v.wx_qr_code) {
                      this.selectors.splice(i, true)
                      data.splice(i, true)
                      this.selectorIds.splice(i, true)
                      wxIds = this.selectorIds.join(',')
                    }
                  })
                  if (!data.length) {
                    this.$message.error('该微信号不存在二维码')
                    this.loading = false
                    this.end()
                    return
                  }
                  API.start_plan({
                    param: JSON.stringify({
                      taskTemplateName: '二维码聚合',
                      planParams: JSON.stringify({
                        planName: this.ruleForm.planName.replace(/\s/g, ''),
                        execute_time: this.ruleForm.execute_time,
                        create_time: getTime(Date.now()),
                        key: redisKey,
                        wxUserId: this.selectorIds,
                        isSinglePlan: 1
                      }),
                      wxIds
                    })
                  }).then((r) => {
                    this.loading = false
                    if (r.data.error_code === 0) {
                      this.$redis.zset.add({
                        key: `QA_added_${redisKey}`,
                        value: this.setRemData(this.selectors)
                      }, 'json')

                      this.$redis.zset.add({
                        key: `QA_wxids_${redisKey}`,
                        value: this.setRemCode(data)
                      }, 'json')

                      this.$redis.string.set({
                        key: `QA_status_${redisKey}`,
                        value: '0'
                      })

                      this.$redis.string.set({
                        key: `QA_start_${redisKey}`,
                        value: this.ruleForm.execute_time
                      })

                      this.success(redisKey)
                      this.end()
                    } else {
                      this.failed()
                    }
                  }).catch(() => { 
                    this.loading = false
                    this.failed()
                  })
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      end() {
        this.$emit('refresh')
        this.selectors = []
        this.handleClose()
      },
      returnIds(ids) {
        this.selectorIds = ids
      },
      setRemCode(data) {
        const newArr = []
        const o = {}
        data.map((v, i) => {
          o[v.wx_user_id] = v
        })
        this.selectorIds.map((v, i) => {
          newArr.push({
            score: i+1,
            value: o[v]
          })
        })
        return newArr
      },
      returnValue(items) {
        if (!items.length) {
          this.ruleForm.wxIds = null
        } else {
          this.ruleForm.wxIds = items.length
        }
        this.selectors = items
      },
      handleClose() {
        this.$refs.ruleForm.resetFields()
        this.selectors = []
        this.$emit('change', false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wx.el-button--mini {
    padding: 4px;
  }
  .wx-line {
    display: inline-block;
    line-height: 40px;
    visibility: hidden;
    &.show {
      visibility: visible;
    }
    a {
      font-size: 13px;
      cursor: pointer;
      color: #409eff
    }
  }
</style>

