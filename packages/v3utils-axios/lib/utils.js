"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.isPlainObject = void 0;
const isPlainObject = (val) => Object.prototype.toString.call(val) === '[object Object]';
exports.isPlainObject = isPlainObject;
function downloadFile(blob, filename) {
    if ('download' in document.createElement('a')) { // 非IE下载
        const a = document.createElement('a');
        a.download = filename;
        a.style.display = 'none';
        a.href = window.URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    }
    else {
        navigator.msSaveBlob(blob, filename);
    }
}
exports.downloadFile = downloadFile;
