import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios'
// @ts-ignore
import qs from 'qs'
import { ref, Ref } from 'vue'
import { isPlainObject, downloadFile } from './utils'

interface CompositionConfig<T> {
  initialData: T
  immediate: boolean
  formatter: (response: AxiosResponse) => any
}

interface CompositionCollection<T, R = AxiosResponse> {
  data: Ref<T>
  response: Ref<AxiosResponse>,
  loading: Ref<boolean>
  error: Ref<Error | undefined>
  task: Promise<AxiosResponse> | (() => Promise<AxiosResponse>)
}

type AdapterTask = <T>(
  compositionConfig: CompositionConfig<T> | T,
  url: string,
  data: Record<string, any>,
  axiosConfig: AxiosRequestConfig
) => CompositionCollection<T>

let service: AxiosInstance
export const customHeaders: Record<string, any> = {}
export const customHeaderBlackMap: Record<string, string[]> = {}

const defaultCompositionConfig: CompositionConfig<undefined> = {
  initialData: undefined,
  immediate: true,
  formatter: (response: AxiosResponse) => response.data
}

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

const formatConfig = <T>(compositionConfig: CompositionConfig<T> | T) => {
  return isPlainObject(compositionConfig)
    ? compositionConfig as CompositionConfig<T>
    : Object.assign(defaultCompositionConfig, { initialData: compositionConfig as T })
}

function createTask<T>(compositionConfig: CompositionConfig<T>, axiosConfig: AxiosRequestConfig): CompositionCollection<T> {
  const { initialData, formatter, immediate } = compositionConfig

  const loading = ref(true)
  const error = ref()
  const data = ref(initialData) as Ref<T>
  const response = ref()

  const task = (): Promise<AxiosResponse> => {
    return service.request(axiosConfig).then(res => {
      response.value = res
      data.value = formatter(res)
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
    task: immediate ? task() : task
  }
}

const createFetchMethod = (method: 'get' | 'head' | 'delete' | 'options', responseType: ResponseType = 'json', download = false): AdapterTask => {
  return <T>(
    compositionConfig: CompositionConfig<T> | T,
    url: string,
    params?: Record<string, any>,
    axiosConfig?: AxiosRequestConfig
  ) => {
    axiosConfig = Object.assign({
      url,
      responseType,
      method,
      params,
    }, axiosConfig)

    return createTask(formatConfig<T>(compositionConfig), axiosConfig)
  }
}

const createModifyMethod = (method: 'post' | 'put' | 'patch', json = false, multipart = false): AdapterTask => {
  return <T>(
    compositionConfig: CompositionConfig<T> | T,
    url: string,
    data?: Record<string, any>,
    axiosConfig?: AxiosRequestConfig
  ) => {

    if (multipart && data) {
      const formData = new FormData()
      Object.keys(data).forEach(key => formData.append(key, data?.[key]))
      data = formData
    }

    axiosConfig = Object.assign({
      url,
      headers: multipart ? { 'Content-Type': 'multipart/form-data' } : undefined,
      method,
      data: json ? data : qs.stringify(data),
    }, axiosConfig)

    return createTask(formatConfig<T>(compositionConfig), axiosConfig)
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



