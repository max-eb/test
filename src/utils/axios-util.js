import qs from 'query-string'
import axios from 'axios'

/**
 * @param resource
 * @param payload
 * @param otherConfig
 * validationMode: true | false | undefined, default is undefined.
 *   Send request on lockout when is true.
 *   Ideally it can only be used to unlock session.
 * token: true|false|undefined, default undefined.
 *   Send request with token when is true or undefined.
 *   Send request without token when is false.
 * @returns {AxiosPromise}
 */

function handlePayload(payload) {
  if (payload !== undefined) {
    return payload
  }
  return null
}

export function createResource(resource, payload, otherConfig) {
  const options = {
    url: resource,
    method: 'POST',
    data: handlePayload(payload),
    headers: {
      'Content-Type': 'application/json'
    },
    // withCredentials: true,
    ...otherConfig
  }
  return axios(options)
}

export function updateResource(resource, payload, otherConfig) {
  const options = {
    url: resource,
    method: 'PATCH',
    data: handlePayload(payload),
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,
    ...otherConfig
  }
  return axios(options)
}

export function uploadResource(resource, formData, otherConfig) {
  const options = {
    url: resource,
    method: 'POST',
    data: handlePayload(formData),
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
    ...otherConfig
  }
  return axios(options)
}

export function destroyResource(resource, payload, otherConfig) {
  const options = {
    url: resource,
    method: 'DELETE',
    data: payload,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    withCredentials: true,
    ...otherConfig
  }
  return axios(options)
}

export function getResource(resource, params, otherConfig) {
  const options = {
    url: resource,
    method: 'GET',
    params,
    paramsSerializer: currentParams => qs.stringify(currentParams, { arrayFormat: 'repeat' }),
    headers: {
      'Content-Type': 'application/json'
    },
    ...otherConfig
  }
  return axios(options)
}

export function submitResource(resource, payload, otherConfig) {
  const options = {
    url: resource,
    method: 'POST',
    data: handlePayload(payload),
    withCredentials: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    ...otherConfig
  }
  return axios(options)
    .catch(exception => Promise.reject(exception))
}

export function putResource(resource, payload, otherConfig) {
  const options = {
    url: resource,
    method: 'PUT',
    data: JSON.stringify(payload),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    withCredentials: true,
    ...otherConfig
  }
  return axios.put(options)
}

export function downloadResource(resource, payload, otherConfig) {
  const options = {
    url: resource,
    method: 'POST',
    data: handlePayload(payload),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*'
    },
    withCredentials: true,
    ...otherConfig
  }
  return axios(options)
}

export function downloadDocuments(documents) {
  documents.forEach(d => fetch(d.url)
    .then(res => res.blob().then((blob) => {
      const a = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = d.title
      a.click()
    })))
}

export const download = (url, title) => fetch(url)
  .then(res => res.blob().then((blob) => {
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(blob)
    a.download = title
    a.click()
  }))

export const downloadDocument = d => download(`${d.url}`, d.title)
