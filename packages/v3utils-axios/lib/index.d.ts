import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Ref } from 'vue';
import { downloadFile } from './utils';
declare type V3utilsCompositionConfig = {
    formatter: (response: AxiosResponse) => any;
} & AxiosRequestConfig;
interface CompositionCollection<T, R = AxiosResponse> {
    data: Ref<T>;
    response: Ref<AxiosResponse>;
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    task: Promise<AxiosResponse> | (() => Promise<AxiosResponse>);
}
declare type AdapterTask = <T>(initialData: T, url: string, payload?: Record<string, any>, config?: V3utilsCompositionConfig) => CompositionCollection<T>;
export declare const customHeaders: Record<string, any>;
export declare const customHeaderBlackMap: Record<string, string[]>;
export declare function create(config: AxiosRequestConfig): AxiosInstance;
export declare const useGet: AdapterTask;
export declare const useHead: AdapterTask;
export declare const useDelete: AdapterTask;
export declare const useOptions: AdapterTask;
export declare const useGetBlob: AdapterTask;
export declare const useHeadBlob: AdapterTask;
export declare const useDeleteBlob: AdapterTask;
export declare const useOptionsBlob: AdapterTask;
export declare const usePost: AdapterTask;
export declare const usePut: AdapterTask;
export declare const usePatch: AdapterTask;
export declare const usePostJSON: AdapterTask;
export declare const usePutJSON: AdapterTask;
export declare const usePatchJSON: AdapterTask;
export declare const usePostMultipart: AdapterTask;
export declare const usePutMultipart: AdapterTask;
export declare const usePatchMultipart: AdapterTask;
export declare const download: typeof downloadFile;
export {};
