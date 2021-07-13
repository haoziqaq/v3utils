import { Plugin } from 'vite';
interface VueRoutesAutoLoadOptions {
    routerFile: string;
    views: string;
}
export default function ({ views, routerFile }?: VueRoutesAutoLoadOptions): Plugin;
export {};
