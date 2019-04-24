import axios from 'axios'
import router from '../router'
import CryptoJS from 'crypto-js'
import publicUrl from '../utils/public.js'
import qs from 'qs'

// 本地测试
// axios.defaults.baseURL = 'http://172.16.0.203:8888/api/v1/'
// axios.defaults.baseURL = 'http://47.99.198.9:8888/api/v1/'
// axios.defaults.baseURL = 'http://172.16.0.249:8888/api/v1/'

let config=publicUrl.info(1);
// let config=publicUrl.info(2);
// let config=publicUrl.info(3);
// let config=publicUrl.info(4);
// let config=publicUrl.info(5);

// 预发布
// axios.defaults.baseURL = 'http://47.111.98.235:8080/api/v1/'
axios.defaults.baseURL = config.baseUrl;




// 正式1
// axios.defaults.baseURL = 'http://47.110.234.49:8888/api/v1/'


//正式2
// axios.defaults.baseURL = 'http://47.244.13.47:8888/api/v1/'


//正式3
// axios.defaults.baseURL = 'http://47.111.97.243:8888/api/v1/'

// axios.defaults.timeout = 5000

let EncryptionList = ['user/login',
  'account/create',
  'wx_group/list',
  'wx_user',
  'wx_wxuser_batch',
  'wx_wxuser/',
  'wx_user_group/wx_user_change_group',
  'wx_user_group/add',
  'terminal/query'
]
let requestUrl = ''


axios.interceptors.request.use(config => {
  let url = config.url.split('?')[0]
  let flag = EncryptionList.indexOf(url) != -1
  requestUrl = ''
  if (config.url !== 'user/login' && config.url !== publicUrl.info().resourceUrl + '/api/v1/text?type=haveNo') {
    config.headers.common['Content-Token'] = sessionStorage.getItem('token')
  }

  if (flag) {
    requestUrl = url
    function getAesString (data, key, iv) { // 加密
      var key = CryptoJS.enc.Utf8.parse(key)
      var iv = CryptoJS.enc.Utf8.parse(iv)
      var encrypted = CryptoJS.AES.encrypt(data, key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        })
      return encrypted.toString() // 返回的是base64格式的密文
    }
    function getAES (data) { // 加密
      var key = 'lx2YJX3TrCVtCsuW' // 密钥
      var iv = '0G5O5PksMZ4JTtvN'
      var encrypted = getAesString(data, key, iv) // 密文
      return encrypted
    }
    let postData = config.data
    config.headers['Enable-Encrypt'] = true
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    config.data = getAES(JSON.stringify(postData))
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})
axios.interceptors.response.use(response => {
  let flag = false
  for (let i = 0; i < EncryptionList.length; i++) {
    if (response.config.url.indexOf(EncryptionList[i]) != -1) {
      flag = true
    }
  };
  if (response.data.error_code == 20001) {
    localStorage.removeItem('token')
    router.replace({
      path: '/login'
    })
    this.$message.closeAll()
  }
  if (flag && (typeof response.data === 'string')) {
    // 解密
    function getDAesString (encrypted, key, iv) { // 解密
      var key = CryptoJS.enc.Utf8.parse(key)
      var iv = CryptoJS.enc.Utf8.parse(iv)
      var decrypted = CryptoJS.AES.decrypt(encrypted, key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      return decrypted.toString(CryptoJS.enc.Utf8)
    }

    function getDAes (data) { // 解密
      var key = 'lx2YJX3TrCVtCsuW' // 密钥
      var iv = '0G5O5PksMZ4JTtvN'
      var decryptedStr = getDAesString(data, key, iv)
      return decryptedStr
    }
    response.data = JSON.parse(getDAes(response.data))
  }
  return response
}, error => {
  if (error.response.data.error_code == 500 && error.response.data.error_message.indexOf('TokenNotValidExceptionexception') > -1) {
    window.location.href = './'
    sessionStorage.removeItem('indentity')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user_id')
    sessionStorage.removeItem('username')
  }
  return Promise.resolve(error.response)
})

const http = (url = '', method = 'GET', data = {}, responseType = 'json') => {
  return new Promise((resolve, reject) => {
    if (method === 'GET') {
      axios.get(url, {
        params: data
      }, responseType)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    } else if (method === 'POST') {
      axios.post(url, data, responseType)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    } else if (method === 'DELETE') {
      axios.delete(url, {
        params: data
      }, responseType)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    } else if (method === 'PUT') {
      axios.put(url, data, responseType)
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
    }
  })
}

export {
  http,
  config
}
