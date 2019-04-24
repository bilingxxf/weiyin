import {http,config} from './http'
import postMan from './apis/redis.json'

const resoueceUrl = `${config.redisUrl}api/v2/`

class Redis {
  list = { list: [] }

  dealStringArray (params, defaultVal) {
    const type = params.constructor
    const o = defaultVal ? { default: defaultVal } : {}
    let data
    switch (type) {
      case Array:
        data = []
        data = params.map((v, i) => {
          const k = {...o}
          k.key = v
          return k
        })
        break
      case String:
        o.key = params
        data = o
        break
      default:
        throw new Error('the of params type is wrong!')
    }
    return data
  }

  wrapStringParams (params) {
    const type = params.constructor
    let data = { ...this.list }
    switch (type) {
      case Array:
        data.list = params
        break
      case Object:
        data.list.push(params)
        break
      default:
        throw new Error('the of params type is wrong!')
    }
    return data
  }

  fetch (params, method = 'POST') {
    const { type, url, bodyType } = params
    let query = ''
    if (type) {
      if (bodyType === 3) query = `?req_data_type=${type}`
      else query = `?rsp_data_type=${type}`
    }
    this.list = { list: [] }
    return http(`${resoueceUrl}${url}${query}`, method, params.params)
  }

  doing (opt) {
    const { bodyType, params } = opt
    switch (bodyType) {
      case 0:
        if (params.constructor === String) {
          opt.params = { key: opt.params }
        }
        break
      case 1:
        opt.params = this.wrapStringParams(opt.params)
        break
      case 2:
        opt.params = this.wrapStringParams(this.dealStringArray(opt.params))
        break
      case 3:
        opt.params.members = opt.params.value
        delete opt.params.value
        break
    }
    return this.fetch(opt)
  }
}

const redis = new Redis()
const selectFunc = (param) => {
  const {key, val, params, type} = param
  const url = `${key}/${val.replace(/_/g, '/')}`
  const opt = { url, bodyType: 0, params, type }
  switch (key) {
    case 'string':
    case 'int':
      switch (val) {
        case 'set':
        case 'incr':
          opt.bodyType = 1
          break
        default:
          opt.bodyType = 2
      }
      break
    default:
      switch (val) {
        case 'add':
        case 'rem':
        case 'has':
        case 'push':
          opt.bodyType = 3
          break
      }
  }
  return redis.doing(opt)
}

for (let key of Object.keys(postMan)) {
  for (let val of postMan[key].func) {
    postMan[key][val.replace(/\//g, '_')] = (params, type) => {
      return selectFunc({key, val, params, type})
    }
  }
}

export default postMan
