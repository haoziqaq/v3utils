import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios'
// @ts-ignore
import qs from 'qs'
import { ref, Ref } from 'vue'
import { downloadFile } from './utils'

interface CompositionCollection<T, R = AxiosResponse> {
  data: Ref<T>
  response: Ref<AxiosResponse>,
  loading: Ref<boolean>
  error: Ref<Error | undefined>
  task: (payload?: Record<string, any>, config?: AxiosRequestConfig) => Promise<AxiosResponse>
}

type AdapterTask = <T>(
  initialData: T,
  url: string,
  payload?: Record<string, any>,
  config?: AxiosRequestConfig
) => CompositionCollection<T>

let service: AxiosInstance
export const customHeaders: Record<string, any> = {}
export const customHeaderBlackMap: Record<string, string[]> = {}

export function create(config: AxiosRequestConfig) {
  service = service != null ? service : axios.create(config)

  service.interceptors.request.use((config) => {
    Object.keys(customHeaders).forEach(key => {
      if (!(customHeaderBlackMap[key] ?? []).includes(config.url as string)) {
        config.headers[key] = customHeaders[key]
      }
    })
    return config
  }, Promise.reject)

  return service
}

function getPayloadConfig(
  preConfig: AxiosRequestConfig,
  payload: Record<string, any> = {},
  type: 'fetch' | 'modify',
  json: boolean = false,
  multipart: boolean = false
) {
  if (type === 'modify') {
    if (json) {
      payload = qs.stringify(payload)
    }

    if (multipart) {
      const formData = new FormData()
      Object.keys(payload).forEach(key => formData.append(key, payload[key]))
      payload = formData
    }

    preConfig.data = payload
  }

  if (type === 'fetch') {
    preConfig.params = payload
  }

  return preConfig
}

function createTask<T>(
  type: 'fetch' | 'modify',
  initialData: T,
  preConfig: AxiosRequestConfig,
  json: boolean = false,
  multipart: boolean = false
): CompositionCollection<T> {
  const loading = ref(true)
  const error = ref()
  const data = ref(initialData) as Ref<T>
  const response = ref()

  const task = (payload?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    config = Object.assign(getPayloadConfig(preConfig, payload, type, json, multipart), config)

    return service.request(config).then(res => {
      response.value = res
      data.value = res.data
      loading.value = false

      return res
    }).catch(err => {
      error.value = err
      loading.value = false

      return err
    })
  }

  return {
    loading,
    data,
    error,
    response,
    task,
  }
}

const createFetchMethod = (method: 'get' | 'head' | 'delete' | 'options', responseType: ResponseType = 'json'): AdapterTask => {
  return <T>(
    initialData: T,
    url: string
  ) => {
    const config = {
      url,
      responseType,
      method,
    }

    return createTask('fetch', initialData, config)
  }
}

const createModifyMethod = (method: 'post' | 'put' | 'patch', json = false, multipart = false): AdapterTask => {
  return <T>(
    initialData: T,
    url: string
  ) => {

    const getHeaders = () => {
      if (multipart) return { 'Content-Type': 'multipart/form-data' }
      if (json) return { 'Content-Type': 'application/json' }
      return { 'Content-Type': 'application/x-www-form-urlencoded' }
    }

    const config = {
      url,
      headers: getHeaders(),
      method
    }

    return createTask('modify', initialData, config, json, multipart)
  }
}

export const useGet = createFetchMethod('get')
export const useHead = createFetchMethod('head')
export const useDelete = createFetchMethod('delete')
export const useOptions = createFetchMethod('options')

export const useGetBlob = createFetchMethod('get', 'blob')
export const useHeadBlob = createFetchMethod('head', 'blob')
export const useDeleteBlob = createFetchMethod('delete', 'blob')
export const useOptionsBlob = createFetchMethod('options', 'blob')

export const usePost = createModifyMethod('post')
export const usePut = createModifyMethod('put')
export const usePatch = createModifyMethod('patch')

export const usePostJSON = createModifyMethod('post', true)
export const usePutJSON = createModifyMethod('put', true)
export const usePatchJSON = createModifyMethod('patch', true)

export const usePostMultipart = createModifyMethod('post', false, true)
export const usePutMultipart = createModifyMethod('put', false, true)
export const usePatchMultipart = createModifyMethod('patch', false, true)

export const download = downloadFile



