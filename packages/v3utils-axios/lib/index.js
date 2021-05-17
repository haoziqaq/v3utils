"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.usePatchMultipart = exports.usePutMultipart = exports.usePostMultipart = exports.usePatchJSON = exports.usePutJSON = exports.usePostJSON = exports.usePatch = exports.usePut = exports.usePost = exports.useOptionsBlob = exports.useDeleteBlob = exports.useHeadBlob = exports.useGetBlob = exports.useOptions = exports.useDelete = exports.useHead = exports.useGet = exports.create = exports.customHeaderBlackMap = exports.customHeaders = void 0;
const axios_1 = __importDefault(require("axios"));
// @ts-ignore
const qs_1 = __importDefault(require("qs"));
const vue_1 = require("vue");
const utils_1 = require("./utils");
let service;
exports.customHeaders = {};
exports.customHeaderBlackMap = {};
const defaultConfig = {
    immediate: true,
    formatter: (response) => response.data
};
function create(config) {
    service = service != null ? service : axios_1.default.create(config);
    service.interceptors.request.use((config) => {
        Object.keys(exports.customHeaders).forEach(key => {
            var _a;
            if (!((_a = exports.customHeaderBlackMap[key]) !== null && _a !== void 0 ? _a : []).includes(config.url)) {
                config.headers[key] = exports.customHeaders[key];
            }
        });
        return config;
    }, Promise.reject);
    return service;
}
exports.create = create;
function createTask(initialData, config) {
    const { formatter, immediate } = config;
    const loading = vue_1.ref(true);
    const error = vue_1.ref();
    const data = vue_1.ref(initialData);
    const response = vue_1.ref();
    const task = () => {
        return service.request(config).then(res => {
            response.value = res;
            data.value = formatter(res);
            loading.value = false;
            return res;
        }).catch(err => {
            error.value = err;
            loading.value = false;
            return err;
        });
    };
    return {
        loading,
        data,
        error,
        response,
        task: immediate ? task() : task
    };
}
const createFetchMethod = (method, responseType = 'json') => {
    return (initialData, url, params, config) => {
        config = Object.assign(Object.assign({ url,
            responseType,
            method,
            params }, defaultConfig), config);
        return createTask(initialData, config);
    };
};
const createModifyMethod = (method, json = false, multipart = false) => {
    return (initialData, url, data, config) => {
        if (multipart && data) {
            const formData = new FormData();
            Object.keys(data).forEach(key => formData.append(key, data === null || data === void 0 ? void 0 : data[key]));
            data = formData;
        }
        config = Object.assign({
            url,
            headers: multipart ? { 'Content-Type': 'multipart/form-data' } : undefined,
            method,
            data: json ? data : qs_1.default.stringify(data),
        }, config);
        return createTask(initialData, config);
    };
};
exports.useGet = createFetchMethod('get');
exports.useHead = createFetchMethod('head');
exports.useDelete = createFetchMethod('delete');
exports.useOptions = createFetchMethod('options');
exports.useGetBlob = createFetchMethod('get', 'blob');
exports.useHeadBlob = createFetchMethod('head', 'blob');
exports.useDeleteBlob = createFetchMethod('delete', 'blob');
exports.useOptionsBlob = createFetchMethod('options', 'blob');
exports.usePost = createModifyMethod('post');
exports.usePut = createModifyMethod('put');
exports.usePatch = createModifyMethod('patch');
exports.usePostJSON = createModifyMethod('post', true);
exports.usePutJSON = createModifyMethod('put', true);
exports.usePatchJSON = createModifyMethod('patch', true);
exports.usePostMultipart = createModifyMethod('post', false, true);
exports.usePutMultipart = createModifyMethod('put', false, true);
exports.usePatchMultipart = createModifyMethod('patch', false, true);
exports.download = utils_1.downloadFile;
