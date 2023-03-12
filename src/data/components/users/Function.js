/* eslint-disable */
import axios from 'axios'
import Cookie from 'js-cookie'

import { Config } from 'src/config/Config'

export function checkToken() {
  return typeof Cookie.get(Config.app_alias + '_access_token') !== 'undefined' ? true : false
}

// export async function queryAPI(arg) {
//     if (!checkToken()) {
//         return [];
//     }
//     const token = Cookie.get(Config.app_alias + "_access_token");
//     try {
//         const response = await axios.get(Config.api_url + arg,{ headers: { 'Authorization': 'Bearer ' + token }})
//         return response.data.result
//     } catch (err) {
//         return []
//     }
// }
export async function queryAPI(arg) {
  // if (!checkToken()) {
  //     return [];
  // }
  // const token = Cookie.get(Config.app_alias + "_access_token");
  // try {
  const response = await axios.get('http://localhost/Sideline/data/userData.json')
  // console.log('response')
  // console.log(response)
  // const response = await axios.get(Config.api_url + arg,{ headers: { 'Authorization': 'Bearer ' + token }})
  // return response.data.result
  return response.data.result
  // } catch (err) {
  //     return []
  // }
}

export async function queryWhereAPI(arg) {
  if (!checkToken()) {
    return []
  }
  const token = Cookie.get(Config.app_alias + '_access_token')
  try {
    const response = await axios.get(Config.api_url + arg.name + '/' + arg.field + '/' + arg.id, {
      headers: { Authorization: 'Bearer ' + token },
    })
    return response.data.result
  } catch (err) {
    return []
  }
}

export async function createAPI(arg) {
  if (!checkToken()) {
    return []
  }
  const token = Cookie.get(Config.app_alias + '_access_token')

  const { formData, hash } = arg.data

  try {
    await axios.post(Config.api_url + arg.name + '?hash=' + hash, formData, {
      headers: { Authorization: 'Bearer ' + token },
    })
    return true
  } catch (err) {
    return false
  }
}

export async function updateAPI(arg) {
  if (!checkToken()) {
    return []
  }
  const token = Cookie.get(Config.app_alias + '_access_token')

  const { formData, hash } = arg.data
  try {
    await axios.put(
      Config.api_url + arg.name + '/' + formData.id + '?hash=' + hash,
      formData.data,
      { headers: { Authorization: 'Bearer ' + token } },
    )
    return true
  } catch (err) {
    return false
  }
}

export async function deleteAPI(arg) {
  if (!checkToken()) {
    return []
  }
  const token = Cookie.get(Config.app_alias + '_access_token')
  try {
    await axios.delete(Config.api_url + arg.name + '/' + arg.data.id + '?hash=' + arg.data.hash, {
      headers: { Authorization: 'Bearer ' + token },
    })
    return true
  } catch (err) {
    return false
  }
}
