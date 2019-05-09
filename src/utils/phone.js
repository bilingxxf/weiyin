import Redis from '@/api/redis'
import { Message } from 'element-ui'

const PHONE_GROUP_ID_KEY = 'phone_group_index'
const USER_PHONE_GROUP_NAME_PREFIX = 'phone_group_name_'
const PHONE_GROUP_INFO_PREFIX = 'phone_group_info_'
const PHONE_GROUP_REPORT_PREFIX = 'phone_group_report_'
const USER_PHONE_GROUP_ID_PREFIX = 'user_phone_group_id_'
const USER_PHONE_GROUP_TIME_PREFIX = 'user_phone_group_time_'
const PHONE_GROUP_DETAIL_ALL_PREFIX = 'phone_group_detail_all_'
const PHONE_GROUP_DETAIL_TMP_PREFIX = 'phone_group_detail_tmp_'
const PHONE_GROUP_DETAIL_UNUSED_PREFIX = 'phone_group_detail_unused_'

class Phone {
  userID = null
  constructor (userID) {
    this.userID = userID
  }
  checkPhoneGroupName (phoneGroupName) {
    return new Promise((resolve, reject) => {
      Redis.set.has({
        key: USER_PHONE_GROUP_NAME_PREFIX + this.userID,
        members: [ phoneGroupName ]
      }).then(res => {
        if (res.data.error_code === 0) {
          const { members } = res.data.data
          resolve(!!members.length)
        } else {
          reject(res)
        }
      })
    })
  }
  getNewPhoneGroupIndex () {
    return Redis.int.incr({ key: PHONE_GROUP_ID_KEY })
  }
  createPhoneGroup (phoneGroupName, callback) {
    const now = (new Date()).getTime()
    this.checkPhoneGroupName(phoneGroupName).then(res => {
      if (res) return Message.error('名字重复')
      this.getNewPhoneGroupIndex().then(res => {
        if (res.data.error_code === 0) {
          const { list } = res.data.data
          let id = list[0].value || 0
          let key = `${PHONE_GROUP_INFO_PREFIX}${id}`
          Redis.string.set(
            {
              key,
              value: {
                id: id,
                name: phoneGroupName,
                updated_at: now,
                all: 0,
                unused: 0,
                used: 0,
                allowed: 0,
                status: 0
              }
            }, 'json').then(res => {
            Redis.zset.add({
              key: USER_PHONE_GROUP_ID_PREFIX + this.userID,
              value: [
                { score: id, value: key }
              ]
            }).then(res => {
              Redis.zset.add({
                key: USER_PHONE_GROUP_TIME_PREFIX + this.userID,
                value: [
                  {score: now, value: key}
                ]
              }).then(res => {
                Message.success('创建成功')
                callback && callback()
              })
            })
          })
        }
      })
    })
  }
  getPhoneGroupReport (phoneGroupID, callback) {
    Redis.list.get({
      key: PHONE_GROUP_REPORT_PREFIX + phoneGroupID,
      start: 0,
      stop: -1
    }).then(res => {
      callback && callback(res.data)
    })
  }
  importPhone (opt) {
    const { phoneGroupID, phones, callback } = opt
    Redis.set.add({
      key: PHONE_GROUP_DETAIL_TMP_PREFIX + phoneGroupID,
      value: phones
    }, 'string').then(res => {
      Redis.set.diff({
        key_a: PHONE_GROUP_DETAIL_TMP_PREFIX + phoneGroupID,
        key_b: PHONE_GROUP_DETAIL_ALL_PREFIX + phoneGroupID
      }).then(res => {
        const { members } = res.data.data
        const membersCount = members.length
        if (membersCount) {
          Redis.set.add({
            key: PHONE_GROUP_DETAIL_ALL_PREFIX + phoneGroupID,
            value: members
          })
          Redis.set.add({
            key: PHONE_GROUP_DETAIL_UNUSED_PREFIX + phoneGroupID,
            value: members
          })

          this.getPhoneGroupInfo(phoneGroupID, info => {
            info.all = info.all + membersCount
            info.unused = info.unused + membersCount
            this.updatePhoneGroupInfo(phoneGroupID, info)
          })
        }
        Redis.set.del({
          key: PHONE_GROUP_DETAIL_TMP_PREFIX + phoneGroupID
        })
        callback && callback()
      })
    })
  }
  getPhoneGroupInfo (phoneGroupID, callback) {
    return Redis.string.get(
      PHONE_GROUP_INFO_PREFIX + phoneGroupID
      , 'json')
  }

  updatePhoneGroupInfo (phoneGroupID, info, callback) {
    return Redis.string.set(
      {key: PHONE_GROUP_INFO_PREFIX + phoneGroupID, value: info}
      , 'json')
  }
  getPhoneGroupList (opt) {
    const { start, end, page, pagesize, callback } = opt
    const offset = page < 1 ? 0 : (page - 1) * (pagesize || 10)
    const getList = (members) => {
      return Redis.string.get(
        members.map(v => {
          return v.value
        }), 'json'
      ).then(res => {
        callback && callback(res)
      })
    }
    if (start && end) {
      Redis.zset.scoreget({
        key: USER_PHONE_GROUP_TIME_PREFIX + this.userID,
        min: start,
        max: end,
        offset: offset,
        count: pagesize || 10,
        rev: false
      }).then(res => {
        getList(res.data.data.members)
      })
    } else {
      Redis.zset.get({
        key: USER_PHONE_GROUP_ID_PREFIX + this.userID,
        start: offset,
        stop: offset + (pagesize || 10),
        rev: false
      }).then(res => {
        getList(res.data.data.members)
      })
    }
  }
}

export default Phone
